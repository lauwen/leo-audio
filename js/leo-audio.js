(function ($) {
    var pluginName = "leoAudio",
    defaults = {
        name : "",
        src : "",
        volume : 0.5,
        pointer : false,
        theme : {
            btnColor : "#888888",
            progressColor : {
                start : "#47CFFF",
                end : "#1D81E4",
                bar : "#1D81E4",
                pointer : "orangered",
                bg : "f5f5f5"
            },
            volumeColor : {
                start : "#47CFFF",
                end : "#1D81E4",
                pointer : "#1D81E4",
                bg : "f5f5f5"
            },
            rateColor : {
                bg : "white",
                font: "black"
            }
        },
        callback : function () {}
    };
    function leoAudio (element, leoAudioId, options) {
        this.element = element;
        this.leoAudioId = leoAudioId;
        this.settings = $.extend(true, $.fn.leoAudio.default, options || {});
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }
    leoAudio.prototype = {
        init : function () {
            var self = this;
            self.renderAudio();
            self.audio = $(self.leoAudioId);
            self.progress_box_width = $(document).find(".lauwen-audio-progress").width();
            if (self.settings.pointer) {
                self.setAudioPointer(self.settings.pointer);
            }
            self.setAudioVolume(self.settings.volume);
            
        },
        renderAudio : function () {
            var leoAudioContent = '<div class="col-md-12">\
                <div class="panel panel-default">\
                    <div class="panel-body lauwen-audio-container">\
                        <div class="col-md-7 lauwen-audio-progress-container" id="lauwen-audio-progress-container">\
                            <div class="row lauwen-audio-info">\
                                <div class="lauwen-audio-info-title">\
                                    去年夏天 - 王大毛\
                                </div>\
                                <div class="lauwen-audio-info-time">\
                                    00:00/00:00\
                                </div>\
                            </div>\
                            <div class="col-md-12 lauwen-audio-progress" id="lauwen-audio-progress">\
                                <div class="lauwen-audio-progress-bar" id="lauwen-audio-progress-bar">\
                                    <div class="lauwen-audio-progress-cursor"></div>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="col-md-5 lauwen-audio-control-container" id="lauwen-audio-control-container">\
                            <select class="lauwen-audio-tools-rate" id="lauwen-audio-tools-rate">\
                                <option>倍速</option>\
                                <option value="1">1.0X</option>\
                                <option value="1.5">1.5X</option>\
                                <option value="2">2.0X</option>\
                                <option value="2.5">2.5X</option>\
                                <option value="3">3.0X</option>\
                            </select>\
                            <div class="lauwen-audio-tools-bar">\
                                <i class="glyphicon glyphicon-step-backward lauwen-audio-prev"></i>\
                                <b class="glyphicon glyphicon-play lauwen-audio-play"></b>\
                                <i class="glyphicon glyphicon-step-forward lauwen-audio-next"></i>\
                                <i class="glyphicon glyphicon-volume-up lauwen-audio-muted"></i>\
                            </div>\
                            <div class="lauwen-audio-volume" id="lauwen-audio-volume">\
                                <div class="lauwen-audio-volume-bar" id="lauwen-audio-volume-bar">\
                                    <div class="lauwen-audio-volume-cursor"></div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>';
            $(this.element).html(leoAudioContent);
        },
        setAudioPointer : function (pointer) {
            var pointerContent = '';
            var self = this;
            self.audio.on("canplay", function () {
                $.each(pointer, function (i, val) {
                    var pointerPosition = ((val['time'] / self.audio.get(0).duration) * self.progress_box_width).toFixed(2);
                    pointerContent += '<div class="lauwen-audio-progress-pointer" \
                        data-toggle="tooltip" \
                        data-placement="top" \
                        title="'+val['name']+'" \
                        data-time="'+val['time']+'" style="left:'+pointerPosition+'px;"></div>';
                })
                $(".lauwen-audio-progress").prepend(pointerContent);
                $(document).find('.lauwen-audio-progress-pointer').tooltip();
            })
        },
        setAudioVolume : function (volume) {
            self.audio.volume = volume;
        }


    }
    $.fn.leoAudio = function (leoAudioId, options) {
        var leo = this;
        leo.each(function() {
            $.data(leo, "plugin_" + pluginName, new leoAudio( this, leoAudioId, options));
        });
        return leo;
    }

})(jQuery)