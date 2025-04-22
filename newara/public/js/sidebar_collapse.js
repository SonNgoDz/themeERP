frappe.ready(() => {
    // Wait for sidebar to be loaded
    const observer = new MutationObserver((mutations) => {
        const sidebar = document.querySelector('.layout-side-section');
        if (sidebar) {
            // Create collapse button
            const collapseButton = document.createElement('button');
            collapseButton.className = 'sidebar-collapse-btn';
            collapseButton.innerHTML = `
                <div class="sidebar-collapse-btn-content">
                    <div class="flex items-center truncate">
                        <span class="sidebar-collapse-btn-icon">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.875 9.06223L3 9.06232" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M6.74537 5.31699L3 9.06236L6.74527 12.8076" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M14.1423 4L14.1423 14.125" stroke="currentColor" stroke-linecap="round"></path>
                            </svg>
                        </span>
                        <span class="sidebar-collapse-btn-text">Collapse</span>
                    </div>
                </div>
            `;

            // Add click handler
            collapseButton.addEventListener('click', () => {
                const body = document.body;
                body.classList.toggle('sidebar-collapsed');
                
                // Update button text and icon
                const textSpan = collapseButton.querySelector('.sidebar-collapse-btn-text');
                const svg = collapseButton.querySelector('svg');
                
                if (body.classList.contains('sidebar-collapsed')) {
                    textSpan.textContent = 'Expand';
                    // Rotate SVG 180 degrees
                    svg.style.transform = 'rotate(180deg)';
                } else {
                    textSpan.textContent = 'Collapse';
                    svg.style.transform = 'rotate(0deg)';
                }
            });

            // Insert button at the top of sidebar
            sidebar.insertBefore(collapseButton, sidebar.firstChild);
            
            // Stop observing once we've added the button
            observer.disconnect();
        }
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}); 