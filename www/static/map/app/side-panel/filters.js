/*define('vc-range-input', {
    template: '<li class="custom">'+
                  '<input v-model="data[0]"/>'+
                  '<span></span>'+
                  '<input v-model="data[1]"/>'+
                  '<button @click="confirm">确认</button>'+
              '</li>',
    props: ['value'],
    data: function () {
        return {
            data: ['', '']
        };
    },
    mounted: function () {
        if (this.value && this.value.length === 2) {
            this.data = [this.value[0], this.value[1]];
        }
        this.data = ['', ''];
    },
    methods: {
        confirm: function () {
            if ($.trim(this.data[0]) === '') {
                return;
            }
            if ($.trim(this.data[1]) === '') {
                return;
            }

            this.data[0] = parseInt(this.data[0]).toString();
            this.data[1] = parseInt(this.data[1]).toString();

            if (this.data[1] > this.data[0]) {
                this.$emit('input', [
                    this.data[0],
                    this.data[1]
                ]);
            } else {
                this.$emit('input', null);
            }
        }
    },
    watch: {
        'value': function () {
            this.data = ['', ''];
        }
    }
});*/

define('vc-filters', {
    template: "#template-filters",
    props: ['value'],
    data: function () {
        return {
            visible: false,
            ableMultipleChoiceFilterIds: ['prop_type']
        }
    },
    computed: {
        data: function () {
            return this.value;
        },
        items: function () {
            return window.$viewData.dicts.filterRules;
        }
    },
    mounted: function () {
        var that = this;
        app.eventHub.$on('filters:cmd-popup', function () {
            that.visible = true;
        });

        app.eventHub.$on('filters:cmd-hide', function () {
            that.visible = false;
        });

        app.eventHub.$on('nav:changed', function () {
            that.visible = false;
        });
    },
    methods: {
        clearItemActive: function (filterId) {
            this.$set(this.data, filterId, null);
            /*
            if (-1 !== ['price', 'square'].indexOf(filterId)) {
                this.$set(this.data.customs, filterId, null);
            }*/
            this.$emit('input', this.data);
        },
        getItemIsActive: function (filterId, value) {
            /*
            if (typeof value === 'undefined' && -1 !== ['price', 'square'].indexOf(filterId)) {
                if (this.data.customs[filterId] !== null) {
                    return false;
                }
            }*/

            if (this.isMultipleChoiceFilter(filterId) && value) { // 多选模式 + 有值
                if (this.data[filterId] instanceof Array) {
                    return this.data[filterId].indexOf(value) !== -1;
                }
                return false;
            }
            
            return this.data[filterId] == value;
        },
        setItemActive: function (filterId, value) {
            /*
            if (-1 !== ['price', 'square'].indexOf(filterId)) {
                this.$set(this.data.customs, filterId, null);
            }*/

            if (this.isMultipleChoiceFilter(filterId)) { // 多选模式
                var values = this.data[filterId];
                if(!values) { // 初始化
                    values = [];
                }

                var findIdx = values.indexOf(value);
                if (findIdx !== -1) { // 删除一项
                    values.splice(findIdx, 1);
                    if (values.length === 0) values = null;
                } else { // 添加一项
                    values.push(value);
                }

                this.$set(this.data, filterId, values); // 通知更新
            } else { // 单选模式
                this.$set(this.data, filterId, value);
            }

            this.$emit('input', this.data);
        },
        confirmCustom: function (filterId) {
            this.data.customs[filterId] = this.customs[filterId];
            console.log(this.data);
        },
        clearAll: function () {
            this.data = {};
            this.$emit('input', this.data);
        },
        isMultipleChoiceFilter: function (filterId) {
            return this.ableMultipleChoiceFilterIds.indexOf(filterId) !== -1;
        }
    }
});