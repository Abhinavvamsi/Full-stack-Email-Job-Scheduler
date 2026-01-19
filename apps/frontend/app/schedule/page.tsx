'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { Upload, Calendar, Send, FileText, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils'; // Assuming you have this utility

// Schema for validation
const scheduleSchema = z.object({
    subject: z.string().min(1, 'Subject is required'),
    body: z.string().min(1, 'Body is required'),
    scheduledAt: z.string().refine((val) => new Date(val) > new Date(), {
        message: 'Scheduled time must be in the future',
    }),
    delayBetweenEmails: z.number().min(0).optional(),
});

type FormData = z.infer<typeof scheduleSchema>;

export default function SchedulePage() {
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [parsedEmails, setParsedEmails] = useState<string[]>([]);
    const [manualEmail, setManualEmail] = useState(''); // For single email entry if needed
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: {
            delayBetweenEmails: 5
        }
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            setMessage({ type: 'error', text: 'Please upload a valid CSV file.' });
            return;
        }

        setCsvFile(file);
        const text = await file.text();
        // Simple CSV parser: assumes emails are in the first column or just a list
        const emails = text
            .split(/\r?\n/)
            .map((row) => row.split(',')[0].trim()) // Take first column
            .filter((email) => email && email.includes('@')); // Basic filter

        setParsedEmails(emails);
        setMessage({ type: 'success', text: `Parsed ${emails.length} emails from CSV.` });
    };

    const removeFile = () => {
        setCsvFile(null);
        setParsedEmails([]);
        setMessage(null);
    }

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        setMessage(null);

        // Combine CSV emails and manual email (if implemented, but let's stick to CSV or single for now)
        // For this V1, let's prioritize the CSV list if present, otherwise maybe a single email field? 
        // The simplified requirement was "CSV Parsing".

        let recipients = parsedEmails;

        // Fallback: If no CSV, maybe we want a manual "To" field? 
        // Let's create a temporary single email input logic for testing convenience.
        if (recipients.length === 0 && manualEmail) {
            recipients = [manualEmail];
        }

        if (recipients.length === 0) {
            setMessage({ type: 'error', text: 'Please upload a CSV with emails or enter a recipient.' });
            setIsLoading(false);
            return;
        }

        try {
            await axios.post('http://localhost:3001/api/schedule', {
                emails: recipients,
                subject: data.subject,
                body: data.body,
                scheduledAt: new Date(data.scheduledAt).toISOString(),
                delayBetweenEmails: data.delayBetweenEmails,
            });

            setMessage({ type: 'success', text: `Successfully scheduled ${recipients.length} emails!` });
            reset(); // Clear form
            setCsvFile(null);
            setParsedEmails([]);
            setManualEmail('');
        } catch (error: any) {
            console.error(error);
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to schedule emails.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold text-[#37352f] mb-2">Schedule Campaign</h1>
                <p className="text-gray-500">Compose your email and set a time for delivery.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Recipients Section */}
                <div className="p-4 border border-[#ECECEC] rounded-sm bg-gray-50/50 space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Upload size={16} /> Recipients
                    </h3>

                    {!csvFile ? (
                        <div className="space-y-3">
                            {/* Manual Entry */}
                            <div>
                                <Label htmlFor="manual-email">Single Recipient (Optional)</Label>
                                <Input
                                    id="manual-email"
                                    placeholder="user@example.com"
                                    value={manualEmail}
                                    onChange={(e) => setManualEmail(e.target.value)}
                                />
                            </div>
                            <div className="text-center text-xs text-gray-400 font-medium">- OR -</div>
                            {/* File Upload */}
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-sm cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload CSV</span></p>
                                        <p className="text-xs text-gray-400">Column 1: Email Address</p>
                                    </div>
                                    <input id="dropzone-file" type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                                </label>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between p-3 bg-white border border-[#ECECEC] rounded-sm shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100/50 rounded-sm">
                                    <FileText size={18} className="text-green-700" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">{csvFile.name}</p>
                                    <p className="text-xs text-gray-500">{parsedEmails.length} recipients found</p>
                                </div>
                            </div>
                            <button type="button" onClick={removeFile} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Campaign Details */}
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="Enter email subject..." {...register('subject')} />
                        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="body">Message Body</Label>
                        <Textarea
                            id="body"
                            placeholder="Write your email content here..."
                            className="min-h-[200px] font-mono text-sm"
                            {...register('body')}
                        />
                        {errors.body && <p className="text-red-500 text-xs mt-1">{errors.body.message}</p>}
                    </div>
                </div>

                {/* Scheduling Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-[#ECECEC] rounded-sm">
                    <div>
                        <Label htmlFor="scheduledAt">Schedule Time</Label>
                        <div className="relative">
                            <Input
                                id="scheduledAt"
                                type="datetime-local"
                                {...register('scheduledAt')}
                            />
                            <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
                        </div>
                        {errors.scheduledAt && <p className="text-red-500 text-xs mt-1">{errors.scheduledAt.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="delay">Delay Between Emails (Seconds)</Label>
                        <div className="relative">
                            <Input
                                id="delay"
                                type="number"
                                min="0"
                                {...register('delayBetweenEmails', { valueAsNumber: true })}
                            />
                            <span className="absolute right-8 top-2 text-xs text-gray-400">sec</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">Staggers sending to avoid rate limits.</p>
                    </div>
                </div>

                {/* Feedback Message */}
                {message && (
                    <div className={cn(
                        "p-3 rounded-sm text-sm border",
                        message.type === 'success' ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200"
                    )}>
                        {message.text}
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isLoading} className="w-full md:w-auto min-w-[140px]">
                        {isLoading ? (
                            <span className="animate-pulse">Scheduling...</span>
                        ) : (
                            <>
                                <Send size={16} className="mr-2" /> Schedule Campaign
                            </>
                        )}
                    </Button>
                </div>

            </form>
        </div>
    );
}
