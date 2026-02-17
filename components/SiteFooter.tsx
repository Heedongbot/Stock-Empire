
import Link from 'next/link';

export default function SiteFooter() {
    return (
        <footer className="border-t border-slate-800 bg-[#020610] py-12 mt-20">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h3 className="text-lg font-black text-white italic uppercase tracking-tighter mb-2">STOCK EMPIRE</h3>
                    <p className="text-xs text-slate-500 font-medium">
                        &copy; {new Date().getFullYear()} Stock Empire. All rights reserved.
                    </p>
                </div>

                <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
                    <Link href="/about" className="hover:text-[#00ffbd] transition-colors">About Us</Link>
                    <Link href="/terms" className="hover:text-[#00ffbd] transition-colors">Terms of Service</Link>
                    <Link href="/privacy" className="hover:text-[#00ffbd] transition-colors">Privacy Policy</Link>
                    <a href="mailto:66683@naver.com" className="hover:text-[#00ffbd] transition-colors">Contact</a>
                </div>
            </div>
        </footer>
    );
}
