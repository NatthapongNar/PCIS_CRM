// CONFIGURATION DEFINITION
export const config = {
    header_menu: [
        { key: 'icon_warroom', name: 'TCRB War Room', icon: 'share-alt', fontAwesome: false, badge: true, disable: false, hide: false }, 
        { key: 'icon_scoreboard', name: 'Scoreboard', icon: 'trophy', fontAwesome: true, badge: true, disable: false, hide: false },
        { key: 'icon_feed', name: 'News Feed', icon: 'rss', fontAwesome: true, badge: true, disable: false, hide: false },
        { key: 'icon_email', name: 'Mail', icon: 'envelope-o', fontAwesome: true, badge: true,  disable: true, hide: true }, 
        { key: 'icon_chat', name: 'Chat', icon: 'message', fontAwesome: false, badge: true,  disable: false, hide: true },
        { key: 'icon_notification', name: 'Notification', icon: 'bell', fontAwesome: false, badge: true,  disable: false, hide: true }
    ],
    sidebar_menu: [
        { key: 'sidebar_document', name: 'Document', icon: 'folder', fontAwesome: false, urlLink: '/document', disable: false, hide: false }, 
        { key: 'sidebar_dashboard', name: 'Dashboard', icon: 'pie-chart', fontAwesome: false, urlLink: null, disable: true, hide: false },
        { key: 'sidebar_application', name: 'Application', icon: 'desktop', fontAwesome: false, urlLink: null, disable: true, hide: false },
        { key: 'sidebar_file', name: 'Files', icon: 'inbox', fontAwesome: false, urlLink: '',  disable: true, hide: true }
    ],
    rootPath: '/pcisgo'
}
