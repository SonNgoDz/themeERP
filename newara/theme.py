from frappe import _
from frappe.theme import Theme

class NewaraTheme(Theme):
    def __init__(self):
        super().__init__()
        self.name = "Newara"
        self.description = "Custom Frappe Theme"
        self.author = "H@LFWARE"
        self.author_email = "contact@half-ware.com"
        self.version = "1.1.3"
        self.website = "https://half-ware.com"
        self.repo = "https://github.com/half-ware/newara"
        self.license = "MIT"
        self.license_link = "https://github.com/half-ware/newara/blob/main/LICENSE"
        self.dependencies = []
        self.theme_path = "newara/public/css/newara.css"
        self.js_path = "newara/public/js/sidebar_collapse.js" 