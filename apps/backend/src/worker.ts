import { Worker } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
};

// Create a nodemailer transporter (placeholder, will be properly configured with Ethereal)
let transporter: nodemailer.Transporter;

async function getTransporter() {
    if (transporter) return transporter;

    // For testing, generating Ethereal account if not provided
    if (!process.env.ETHEREAL_USER) {
        const testAccount = await nodemailer.createTestAccount();
        console.log('Ethereal Account Created:', testAccount.user, testAccount.pass);
        transporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    } else {
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.ETHEREAL_USER,
                pass: process.env.ETHEREAL_PASS,
            },
        });
    }
    return transporter;
}

export const setupWorker = () => {
    const worker = new Worker('email-queue', async (job) => {
        const { jobId } = job.data;

        try {
            // Fetch job details
            const jobRecord = await prisma.job.findUnique({ where: { id: jobId } });
            if (!jobRecord) throw new Error('Job not found in DB');

            console.log(`Processing job ${jobId}: Sending email to ${jobRecord.email}`);

            // Simulate Rate Limiting / Minimum Delay between sends
            // This is useful if the provider has strict qps limits (e.g. 1 email per sec)
            const MIN_DELAY_BETWEEN_SENDS = 1000; // 1 second
            await new Promise(r => setTimeout(r, MIN_DELAY_BETWEEN_SENDS));

            const mailer = await getTransporter();

            const info = await mailer.sendMail({
                from: '"ReachInbox Scheduler" <scheduler@reachinbox.com>',
                to: jobRecord.email,
                subject: jobRecord.subject,
                text: jobRecord.body,
            });

            console.log(`Email sent: ${info.messageId}`);
            console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

            // Update DB status
            await prisma.job.update({
                where: { id: jobId },
                data: {
                    status: 'SENT',
                    sentAt: new Date(),
                },
            });

        } catch (error) {
            console.error(`Job ${jobId} failed:`, error);

            // Update DB status to FAILED
            await prisma.job.update({
                where: { id: jobId },
                data: {
                    status: 'FAILED',
                },
            });

            throw error; // Let BullMQ handle retry if configured
        }
    }, {
        connection,
        concurrency: parseInt(process.env.WORKER_CONCURRENCY || '1'),
        limiter: {
            max: parseInt(process.env.MAX_EMAILS_PER_HOUR || '100'),
            duration: 3600000 // 1 hour
        }
    });

    worker.on('completed', (job) => {
        console.log(`Job ${job.id} has completed!`);
    });

    worker.on('failed', (job, err) => {
        console.log(`Job ${job?.id} has failed with ${err.message}`);
    });
};
