frappe.ready(() => {
    let isObserving = true;

    const modifyToggleButton = () => {
        const toggleButton = document.querySelector('.sidebar-toggle-btn');
        if (!toggleButton || !isObserving) return;

        // Store original click handler if exists
        const originalClickHandler = toggleButton.onclick;

        // Update button classes and structure
        toggleButton.className = 'btn-reset sidebar-toggle-btn sidebar-collapse-btn';
        toggleButton.innerHTML = `
            <div class="sidebar-collapse-btn-content">
                <div class="flex items-center truncate">
                    <span class="sidebar-collapse-btn-icon">
                        <svg class="es-icon icon-md" aria-hidden="true">
                            <use href="#es-line-${document.body.classList.contains('sidebar-collapsed') ? 'right' : 'left'}"></use>
                        </svg>
                    </span>
                    <span class="sidebar-collapse-btn-text">Collapse</span>
                </div>
            </div>
        `;

        // Add click handler
        toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const body = document.body;
            const sidebar = document.querySelector('.layout-side-section');
            
            if (sidebar) {
                body.classList.toggle('sidebar-collapsed');
                
                // Update button text and icon
                const textSpan = toggleButton.querySelector('.sidebar-collapse-btn-text');
                const svg = toggleButton.querySelector('svg use');
                
                if (body.classList.contains('sidebar-collapsed')) {
                    textSpan.textContent = 'Expand';
                    svg.setAttribute('href', '#es-line-right');
                } else {
                    textSpan.textContent = 'Collapse';
                    svg.setAttribute('href', '#es-line-left');
                }

                // Call original handler if exists
                if (originalClickHandler) {
                    originalClickHandler.call(toggleButton, e);
                } else {
                    // Fallback to ERPNext's toggle
                    frappe.ui.toolbar.toggle_sidebar();
                }
            }
        });

        // Stop observing
        isObserving = false;
    };

    // Initial check
    modifyToggleButton();

    // Set up observer as fallback
    const observer = new MutationObserver(() => {
        if (isObserving) {
            modifyToggleButton();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Clean up observer when page unloads
    window.addEventListener('beforeunload', () => {
        observer.disconnect();
    });

    // Add toggle button to sidebar
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'sidebar-toggle-btn';
    toggleBtn.innerHTML = `
        <svg class="es-icon es-line" aria-hidden="true">
            <use href="#es-line-${document.body.classList.contains('sidebar-collapsed') ? 'right' : 'left'}"></use>
        </svg>
    `;

    // Add click handler
    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('sidebar-collapsed');
        toggleBtn.querySelector('use').setAttribute('href', 
            `#es-line-${document.body.classList.contains('sidebar-collapsed') ? 'right' : 'left'}`
        );
    });

    // Add button to sidebar
    document.querySelector('.layout-side-section').appendChild(toggleBtn);
}); 