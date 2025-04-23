frappe.provide('newara.sidebar');

newara.sidebar = {
    init: function() {
        this.bindEvents();
        this.initDragAndDrop();
        this.initDropdowns();
    },

    bindEvents: function() {
        // Toggle sections
        $(document).on('click', '.standard-sidebar-label', function() {
            newara.sidebar.toggleSection($(this));
        });

        // Handle filter changes
        $(document).on('change', '.filter-input input', function() {
            newara.sidebar.handleFilterChange($(this));
        });

        // Handle tag clicks
        $(document).on('click', '.sidebar-tag', function() {
            newara.sidebar.handleTagClick($(this));
        });

        // Handle save filter
        $(document).on('click', '.save-filter-btn', function() {
            newara.sidebar.saveFilter();
        });

        // Handle edit filters
        $(document).on('click', '.edit-filters', function() {
            newara.sidebar.openFilterEditor();
        });
    },

    toggleSection: function($button) {
        var $section = $button.closest('.standard-sidebar-section');
        var $content = $section.find('.sidebar-section');
        var $icon = $button.find('.es-icon');
        
        // Animate content
        $content.slideToggle(300, function() {
            var isExpanded = $content.is(':visible');
            
            // Update button state
            $button.attr('aria-expanded', isExpanded);
            
            // Rotate icon
            $icon.css('transform', isExpanded ? 'rotate(180deg)' : 'rotate(0deg)');
            
            // Save state in localStorage
            newara.sidebar.saveSectionState($section.data('title'), isExpanded);
        });
    },

    initDropdowns: function() {
        // Initialize dropdown buttons
        $(document).on('click', '.dropdown-btn', function(e) {
            e.stopPropagation();
            var $dropdown = $(this).next('.dropdown-list');
            
            // Close other dropdowns
            $('.dropdown-list').not($dropdown).addClass('hidden');
            
            // Toggle current dropdown
            $dropdown.toggleClass('hidden');
            
            // Position dropdown
            if (!$dropdown.hasClass('hidden')) {
                newara.sidebar.positionDropdown($dropdown);
            }
        });

        // Close dropdowns when clicking outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.dropdown-btn, .dropdown-list').length) {
                $('.dropdown-list').addClass('hidden');
            }
        });

        // Handle dropdown item selection
        $(document).on('click', '.dropdown-item', function() {
            var value = $(this).data('value');
            var label = $(this).text();
            var $button = $(this).closest('.desk-sidebar-item').find('.sidebar-item-label');
            
            $button.text(label);
            newara.sidebar.handleDropdownSelection(value, label);
        });
    },

    initDragAndDrop: function() {
        var items = document.querySelectorAll('.desk-sidebar-item');
        var dragSrcEl = null;

        items.forEach(function(item) {
            item.setAttribute('draggable', true);
            
            item.addEventListener('dragstart', function(e) {
                dragSrcEl = this;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', this.outerHTML);
                this.classList.add('dragging');
            });

            item.addEventListener('dragenter', function(e) {
                this.classList.add('drag-over');
            });

            item.addEventListener('dragleave', function(e) {
                this.classList.remove('drag-over');
            });

            item.addEventListener('dragover', function(e) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                return false;
            });

            item.addEventListener('drop', function(e) {
                e.stopPropagation();
                
                if (dragSrcEl !== this) {
                    // Get positions
                    var allItems = [...this.parentElement.children];
                    var fromIndex = allItems.indexOf(dragSrcEl);
                    var toIndex = allItems.indexOf(this);
                    
                    // Swap elements
                    this.parentElement.insertBefore(dragSrcEl, toIndex < fromIndex ? this : this.nextSibling);
                    
                    // Save new order
                    newara.sidebar.saveItemsOrder();
                }
                
                return false;
            });

            item.addEventListener('dragend', function() {
                items.forEach(function(item) {
                    item.classList.remove('dragging', 'drag-over');
                });
            });
        });
    },

    handleFilterChange: function($input) {
        var value = $input.val();
        var fieldname = $input.data('fieldname');
        
        frappe.call({
            method: 'newara.api.apply_filter',
            args: {
                fieldname: fieldname,
                value: value
            },
            callback: function(r) {
                if (!r.exc) {
                    frappe.show_alert({
                        message: __('Filter applied'),
                        indicator: 'green'
                    });
                    // Refresh list view if needed
                    if (cur_list) cur_list.refresh();
                }
            }
        });
    },

    handleTagClick: function($tag) {
        var tag = $tag.data('tag');
        
        // Toggle tag selection
        $tag.toggleClass('selected');
        
        // Apply tag filter
        frappe.call({
            method: 'newara.api.toggle_tag_filter',
            args: {
                tag: tag
            },
            callback: function(r) {
                if (!r.exc && cur_list) {
                    cur_list.refresh();
                }
            }
        });
    },

    saveFilter: function() {
        var filterName = $('.filter-input input').val();
        if (!filterName) {
            frappe.throw(__('Please enter a filter name'));
            return;
        }
        
        frappe.call({
            method: 'newara.api.save_filter',
            args: {
                name: filterName,
                filters: cur_list.filter_area.get(),
                is_global: $('.is-global-filter').prop('checked')
            },
            callback: function(r) {
                if (!r.exc) {
                    frappe.show_alert({
                        message: __('Filter saved successfully'),
                        indicator: 'green'
                    });
                    newara.sidebar.refreshSavedFilters();
                }
            }
        });
    },

    openFilterEditor: function() {
        if (cur_list) {
            cur_list.filter_area.show();
        }
    },

    refreshSavedFilters: function() {
        frappe.call({
            method: 'newara.api.get_saved_filters',
            callback: function(r) {
                if (!r.exc) {
                    var html = newara.sidebar.renderSavedFilters(r.message);
                    $('.saved-filters').html(html);
                }
            }
        });
    },

    renderSavedFilters: function(filters) {
        var html = filters.map(function(filter) {
            return `
                <div class="desk-sidebar-item standard-sidebar-item" data-filter="${filter.name}">
                    <a href="#" class="item-anchor">
                        <span class="sidebar-item-icon">
                            <svg class="icon icon-md">
                                <use href="#icon-filter"></use>
                            </svg>
                        </span>
                        <span class="sidebar-item-label">${filter.title}</span>
                        <div class="sidebar-item-control">
                            <button class="btn btn-xs btn-default remove-filter">
                                <svg class="icon icon-sm">
                                    <use href="#icon-close"></use>
                                </svg>
                            </button>
                        </div>
                    </a>
                </div>
            `;
        }).join('');
        
        return html;
    },

    saveSectionState: function(section, isExpanded) {
        var key = 'sidebar_section_' + section;
        localStorage.setItem(key, isExpanded);
    },

    restoreSectionStates: function() {
        $('.standard-sidebar-section').each(function() {
            var section = $(this).data('title');
            var key = 'sidebar_section_' + section;
            var isExpanded = localStorage.getItem(key) === 'true';
            
            if (!isExpanded) {
                var $content = $(this).find('.sidebar-section');
                var $button = $(this).find('.standard-sidebar-label');
                var $icon = $button.find('.es-icon');
                
                $content.hide();
                $button.attr('aria-expanded', false);
                $icon.css('transform', 'rotate(0deg)');
            }
        });
    },

    saveItemsOrder: function() {
        var order = [];
        $('.desk-sidebar-item').each(function() {
            order.push($(this).data('name'));
        });
        
        frappe.call({
            method: 'newara.api.save_sidebar_order',
            args: {
                order: order
            }
        });
    },

    positionDropdown: function($dropdown) {
        var $button = $dropdown.prev('.dropdown-btn');
        var buttonOffset = $button.offset();
        var buttonHeight = $button.outerHeight();
        
        $dropdown.css({
            top: buttonOffset.top + buttonHeight + 'px',
            left: buttonOffset.left + 'px',
            minWidth: $button.outerWidth() + 'px'
        });
    }
};

// Initialize sidebar when document is ready
$(document).ready(function() {
    newara.sidebar.init();
    newara.sidebar.restoreSectionStates();
}); 