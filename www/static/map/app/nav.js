define('vc-nav', {
    template: "#template-nav",
    data: function () {
        return {
            current: 'areas',
            menuItems: {
                'areas': {
                    'text': 'AREAS',
                    'icon': 'icon-area'
                },
                'schools': {
                    'text': 'SCHOOLS',
                    'icon': 'icon-xuequ',
                    'hide': window.$viewData.type === 'lease'
                },
                'subwaies': {
                    'text': 'SUBWAY',
                    'icon': 'icon-ditie'
                }
            },
        };
    },
    mounted: function () {
        var that = this;
        var currentId = 'areas';  // 默认切换到区域标签

        if (window.location.hash !== '') {
            currentId = window.location.hash.replace('#', '');
        }

        setTimeout(function () { // 等待加载完成
            that.switchMenu(currentId);
        }, 10);
    },
    methods: {
        switchMenu: function (menuId) {
            window.location.hash = '#' + menuId;
            this.current = menuId;
            app.eventHub.$emit('nav:changed', menuId);
            app.eventHub.$emit('nav:changed.' + menuId);
        },
    },
})
