frappe.ready(() => {
    // Remove any existing toggle buttons
    const toggleButtons = document.querySelectorAll('.sidebar-toggle-btn');
    toggleButtons.forEach(btn => btn.remove());

    // Remove sidebar-collapsed class if it exists
    document.body.classList.remove('sidebar-collapsed');

    // Prevent any future collapsing
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (document.body.classList.contains('sidebar-collapsed')) {
                    document.body.classList.remove('sidebar-collapsed');
                }
            }
        });
    });

    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });

    // Clean up observer when page unloads
    window.addEventListener('beforeunload', () => {
        observer.disconnect();
    });
}); 