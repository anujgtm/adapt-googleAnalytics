define([
    'coreJS/adapt'
], function(Adapt) {

    var GoogleAnalytics = _.extend({

        _id: null,
        _code: null,

        initialize: function () {
            // Get Google Analytics Code
            this.listenToOnce(Adapt, "app:dataReady", this.onDataReady);
            // Listen to route change and update page for google analytics
            this.listenTo(Adapt, "router:location", this.onRouterLocation);
        },

        onDataReady: function() {
            
            // Get Analytics Code
            var analyticsData = this.getAnalyticsData();

            if (analyticsData !== false) {
                this._id = analyticsData._id;
                this._code = analyticsData._code;
                
                // Append body with Analytics code and create instance
                $("body").append(this._code);
                if (typeof ga !== "undefined" && ga !== null) {
                    ga('create', this._id, 'auto');
                }
            }
        },


        getAnalyticsData: function() {
            var courseAnalyticsModel = Adapt.course.get('_analytics');

            if (!courseAnalyticsModel || !courseAnalyticsModel._isEnabled) {
                return false;
            } else {
                return courseAnalyticsModel;
            }
                
        },

        onRouterLocation: function() {
            
            if (this._code != null) {

                // Set Google Analytics page and update pageview
                if (typeof ga !== "undefined" && ga !== null) {
                    ga('set', 'page', '/' + Backbone.history.getFragment());
                    ga('send', 'pageview');
                }
            }
        }

    }, Backbone.Events)

    GoogleAnalytics.initialize();

});
