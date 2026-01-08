import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="border-t border-border py-6 px-4 mt-auto">
            <div className="max-w-2xl mx-auto text-center">
                <p className="text-xs text-muted mb-3">© 2026 Quietly. All rights reserved.</p>
                <div className="flex justify-center gap-4 text-xs">
                    <Link href="/terms" className="text-muted hover:text-foreground transition-colors">
                        Terms
                    </Link>
                    <Link href="/privacy" className="text-muted hover:text-foreground transition-colors">
                        Privacy
                    </Link>
                    <Link href="/contact" className="text-muted hover:text-foreground transition-colors">
                        Contact
                    </Link>
                </div>
            </div>
        </footer>
    )
}
