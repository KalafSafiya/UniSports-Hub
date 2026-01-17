function Footer() {
    return (
        <footer className="bg-background-light dark:bg-background-dark mt-12">
            <div className="mx-auto max-w-7xl border-t border-stone-200 px-4 py-8 dark:border-stone-800 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-stone-600 dark:text-stone-400">© 2024 University Sports Council. All rights reserved.</p>
                <div className="flex items-center gap-6">
                    {["About Us", "Contact", "Privacy Policy", "Terms of Service"].map((link) => (
                        <a key={link} href="#" className="text-sm font-medium text-stone-600 hover:text-primary dark:text-stone-400 dark:hover:text-primary">{link}</a>
                    ))}
                </div>
            </div>
        </footer>
    );
}

export default Footer;
