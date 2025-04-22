frappe.ready(() => {
    // Wait for sidebar toggle button to be loaded
    const observer = new MutationObserver((mutations) => {
        const toggleButton = document.querySelector('.sidebar-toggle-btn');
        if (toggleButton) {
            // Update button classes and structure
            toggleButton.className = 'btn-reset sidebar-toggle-btn sidebar-collapse-btn';
            toggleButton.innerHTML = `
                <div class="sidebar-collapse-btn-content">
                    <div class="flex items-center truncate">
                        <span class="sidebar-collapse-btn-icon">
                            <svg class="es-icon icon-md" aria-hidden="true">
                                <use href="#es-line-sidebar-collapse"></use>
                            </svg>
                        </span>
                        <span class="sidebar-collapse-btn-text">Collapse</span>
                    </div>
                </div>
            `;

            // Add click handler
            toggleButton.addEventListener('click', (e) => {
                e.preventDefault();
                const body = document.body;
                const sidebar = document.querySelector('.layout-side-section');
                
                if (sidebar) {
                    body.classList.toggle('sidebar-collapsed');
                    
                    // Update button text and icon
                    const textSpan = toggleButton.querySelector('.sidebar-collapse-btn-text');
                    const svg = toggleButton.querySelector('svg');
                    
                    if (body.classList.contains('sidebar-collapsed')) {
                        textSpan.textContent = 'Expand';
                        // Rotate SVG 180 degrees
                        svg.style.transform = 'rotate(180deg)';
                        // Trigger ERPNext's sidebar collapse
                        frappe.ui.toolbar.toggle_sidebar();
                    } else {
                        textSpan.textContent = 'Collapse';
                        svg.style.transform = 'rotate(0deg)';
                        // Trigger ERPNext's sidebar expand
                        frappe.ui.toolbar.toggle_sidebar();
                    }
                }
            });

            // Stop observing once we've modified the button
            observer.disconnect();
        }
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}); 