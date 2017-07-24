define('vc-search', {
    template: "#template-search",
    props: ['value'],
    data: function () {
        return {
            q: this.value
        };
    },
    mounted: function () {
        this.init();
    },
    methods: {
        init: function () {
            var that = this;
            $.typeahead({
                input: '#q-input',
                minLength: 1,
                delay: 500,
                order: "desc",
                source: {
                    city: {
                        display: "name",
                        // href: "{{name}}",
                        ajax: {
                            url: '/estate/autocomplete/',
                            path: "cities"
                        }
                    }
                },
                template: function (query, item) {
                    return "{{name}} <small style='color:#999;'>{{type}}</small>";
                },
                callback: {
                    onClickAfter: function (node, a, item, event) {
                        that.q = item.name;
                        that.handleConfirm();
                    }
                }
            });
            $('#q-input').keydown(function (event) {
                if (event.keyCode == 13) {
                    that.handleConfirm();
                }
            });
        },
        handleConfirm: function () {
            if (this.q && $.trim(this.q) !== '') {
                this.$emit('input', this.q);
            }
        }
    }
});