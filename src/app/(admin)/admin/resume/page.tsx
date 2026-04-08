import { prisma } from "@/lib/prisma";
import { updateResume } from "@/app/actions/admin";

/**
 * ResumeManagerPage Component
 * 
 * Allows the admin to upload PDF and Word versions of their résumé.
 * These files are stored on the server and served via the download proxy.
 */
export default async function ResumeManagerPage() {
    // Check the current status of the resume files in the database.
    const resume = await prisma.resume.findFirst();

    return (
        <div className="flex flex-col gap-8 max-w-5xl">
            <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2">Manage <span className="text-[#ff3366]">Resume / CV</span></h1>
                <p className="text-zinc-500 font-mono text-sm mb-6">Upload core documents to be dynamically served from the 3D model.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="border border-[#ff3366]/20 bg-[#0a192f] p-6 rounded-xl self-start">
                    <h2 className="text-lg font-bold text-white mb-4 uppercase">Upload New Files</h2>
                    <form action={updateResume} className="flex flex-col gap-5">

                        <div>
                            <label className="text-xs text-zinc-400 font-mono uppercase mb-1 block">PDF Upload (.pdf)</label>
                            <input name="pdf" type="file" accept="application/pdf" className="w-full bg-[#020c18] border border-white/10 rounded p-2 text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#ff3366]/10 file:text-[#ff3366] hover:file:bg-[#ff3366]/20 focus:border-[#ff3366]/50 outline-none transition-colors" />
                        </div>

                        <div>
                            <label className="text-xs text-zinc-400 font-mono uppercase mb-1 block">Word Upload (.docx)</label>
                            <input name="word" type="file" accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="w-full bg-[#020c18] border border-white/10 rounded p-2 text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#ff3366]/10 file:text-[#ff3366] hover:file:bg-[#ff3366]/20 focus:border-[#ff3366]/50 outline-none transition-colors" />
                        </div>

                        <div>
                            <label className="text-xs text-zinc-400 font-mono uppercase mb-1 block">External Link URL (Optional)</label>
                            <input name="linkUrl" type="url" placeholder="https://..." defaultValue={resume?.linkUrl || ''} className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#ff3366]/50 outline-none" />
                        </div>

                        <button type="submit" className="w-full py-3 mt-4 rounded border border-[#ff3366]/30 bg-[#ff3366]/10 text-[#ff3366] font-bold text-sm tracking-widest uppercase hover:bg-[#ff3366]/20 transition-colors cursor-pointer">
                            Upload & Deploy
                        </button>
                    </form>
                </div>

                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-white uppercase">Current Status</h2>

                    <div className="p-6 border border-white/5 bg-[#0a192f] rounded-xl flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-zinc-500 font-mono uppercase">PDF Document</span>
                            {resume?.pdfUrl ? (
                                <a href={resume.pdfUrl} target="_blank" className="text-[#ff3366] text-sm break-all hover:underline">{resume.pdfUrl}</a>
                            ) : (
                                <span className="text-zinc-600 text-sm italic">Not Uploaded</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1 border-t border-white/5 pt-4">
                            <span className="text-xs text-zinc-500 font-mono uppercase">Word Document</span>
                            {resume?.wordUrl ? (
                                <a href={resume.wordUrl} target="_blank" className="text-[#00e5ff] text-sm break-all hover:underline">{resume.wordUrl}</a>
                            ) : (
                                <span className="text-zinc-600 text-sm italic">Not Uploaded</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1 border-t border-white/5 pt-4">
                            <span className="text-xs text-zinc-500 font-mono uppercase">External Link</span>
                            {resume?.linkUrl ? (
                                <a href={resume.linkUrl} target="_blank" className="text-white text-sm break-all hover:underline">{resume.linkUrl}</a>
                            ) : (
                                <span className="text-zinc-600 text-sm italic">Not Configured</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
