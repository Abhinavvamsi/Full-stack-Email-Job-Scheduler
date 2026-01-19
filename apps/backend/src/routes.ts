import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { emailQueue } from './queue';

export const router = Router();
const prisma = new PrismaClient();

// Schedule emails (Bulk support)
router.post('/schedule', async (req, res) => {
    try {
        const { emails, subject, body, scheduledAt, delayBetweenEmails = 0 } = req.body;

        if (!emails || !Array.isArray(emails) || emails.length === 0 || !subject || !body || !scheduledAt) {
            return res.status(400).json({ error: 'Missing required fields or invalid emails array' });
        }

        const scheduledTime = new Date(scheduledAt);
        const initialDelay = scheduledTime.getTime() - Date.now();
        const baseDelay = initialDelay > 0 ? initialDelay : 0;

        const jobs = [];

        for (let i = 0; i < emails.length; i++) {
            const email = emails[i];

            // Stagger emails if a delay is requested, otherwise all send at scheduled time
            // Note: Worker also has rate limiting, but this ensures we don't dump everything at once if checked.
            const staggerDelay = i * (delayBetweenEmails * 1000);
            const totalDelay = baseDelay + staggerDelay;
            const jobScheduledAt = new Date(Date.now() + totalDelay);

            const job = await prisma.job.create({
                data: {
                    email,
                    subject,
                    body,
                    scheduledAt: jobScheduledAt,
                    status: 'PENDING',
                },
            });

            await emailQueue.add('send-email', { jobId: job.id }, {
                delay: totalDelay,
                jobId: job.id
            });

            jobs.push(job);
        }

        res.json({ message: 'Emails scheduled', count: jobs.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Get all jobs
router.get('/jobs', async (req, res) => {
    const jobs = await prisma.job.findMany({
        orderBy: { createdAt: 'desc' },
    });
    res.json(jobs);
});
