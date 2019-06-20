(function ($) {
    var pluginName = "leoAudio",
    defaults = {
        name : "Unknown-Audio",
        src : "",
        volume : 0.5,
        pointer : false,
        theme : {
            bgColor :  "#ffffff",
            btnColor : "#888888",
            progressColor : {
                start : "#47CFFF",
                end : "#1D81E4",
                bar : "#1D81E4",
                cursor : "#1d83ec",
                pointer : "orangered",
                bg : "f5f5f5"
            },
            volumeColor : {
                start : "#47CFFF",
                end : "#1D81E4",
                cursor : "#1d83ec",
                pointer : "#1D81E4",
                bg : "#f5f5f5"
            },
            rateColor : {
                bg : "white",
                font: "black",
                border: "#888888"
            }
        },
        callback : function () {}
    };
    function leoAudio (element, leoAudioId, options) {
        this.element = element;
        this.leoAudioId = leoAudioId;
        this.settings = $.extend(true, defaults, options || {});
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
            self.volume_box_width = $(document).find(".lauwen-audio-volume").width();
            if (self.settings.pointer) {
                self.setAudioPointer(self.settings.pointer);
            }
            if (self.settings.volume >= 0 && self.settings.volume <= 1) {
                self.setAudioVolume(self.settings.volume, self.volume_box_width);
            }
            self.setAudioName(self.settings.name);
            self.setAudioDuration();
            self.setAudioTheme();
            self.audioPlayOrPause();
            self.audioMuted();
            self.audioRate();
            self.controlProgressBar(self.progress_box_width);
            self.controlVolumeBar(self.volume_box_width);
        },
        renderAudio : function () {
            var leoAudioContent = '<div class="col-md-12">\
                <div class="panel panel-default">\
                    <div class="panel-body lauwen-audio-container">\
                        <div class="col-md-7 lauwen-audio-progress-container" id="lauwen-audio-progress-container">\
                            <div class="row lauwen-audio-info">\
                                <div class="lauwen-audio-info-title">\</div>\
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
                            <div class="lauwen-audio-tools-bar">\
                                <i class="glyphicon glyphicon-step-backward lauwen-audio-prev" style="display:none"></i>\
                                <b class="glyphicon glyphicon-play lauwen-audio-play"></b>\
                                <i class="glyphicon glyphicon-step-forward lauwen-audio-next" style="display:none"></i>\
                                <i class="glyphicon glyphicon-volume-up lauwen-audio-muted"></i>\
                            </div>\
                            <div class="lauwen-audio-volume" id="lauwen-audio-volume">\
                                <div class="lauwen-audio-volume-bar" id="lauwen-audio-volume-bar">\
                                    <div class="lauwen-audio-volume-cursor"></div>\
                                </div>\
                            </div>\
                            <select class="lauwen-audio-tools-rate" id="lauwen-audio-tools-rate">\
                                <option value="" disabled selected hidden>rate</option>\
                                <option value="1">1.0X</option>\
                                <option value="1.5">1.5X</option>\
                                <option value="2">2.0X</option>\
                                <option value="2.5">2.5X</option>\
                                <option value="3">3.0X</option>\
                            </select>\
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
                        data-time="'+val['time']+'" style="left:'+pointerPosition+'px;background-color:'+self.settings.theme.progressColor.pointer+'"></div>';
                })
                $(".lauwen-audio-progress").prepend(pointerContent);
                $(document).find('.lauwen-audio-progress-pointer').tooltip();
            })
        },
        setAudioVolume : function (volume, width) {
            this.audio.get(0).volume = volume;
            $(document).find('.lauwen-audio-volume-bar').css('width', volume * width);
        },
        setAudioName : function (name) {
            $(document).find(".lauwen-audio-info-title").text(name);
        },
        setAudioDuration : function () {
            var self = this;
            self.audio.on("canplay", function () {
                $(document).find(".lauwen-audio-info-time").text("00:00/" + self.changeSecondToTime(self.audio.get(0).duration));
            })
        },
        setAudioTheme : function () {
            var theme = this.settings.theme;
            $(".lauwen-audio-container").css("background-color", theme.bgColor);
            $(".lauwen-audio-tools-bar").children().css("color", theme.btnColor);
            $(".lauwen-audio-progress").css("background-color", theme.progressColor.bg);
            $(".lauwen-audio-progress-cursor").css("background-color", theme.progressColor.cursor);
            $(".lauwen-audio-progress-bar").css({
                "background": "-webkit-linear-gradient(left, "+ theme.progressColor.start +", "+ theme.progressColor.end +")",
                "background": "-o-linear-gradient(right, "+ theme.progressColor.start +", "+ theme.progressColor.end +")",
                "background": "-moz-linear-gradient(right, "+ theme.progressColor.start +", "+ theme.progressColor.end +")",
                "background": "linear-gradient(to right, "+ theme.progressColor.start +", "+ theme.progressColor.end +")",
            });
            $(".lauwen-audio-volume").css("background-color", theme.volumeColor.bg);
            $(".lauwen-audio-volume-cursor").css("background-color", theme.volumeColor.cursor);
            $(".lauwen-audio-volume-bar").css({
                "background": "-webkit-linear-gradient(left, "+ theme.volumeColor.start +", "+ theme.volumeColor.end +")",
                "background": "-o-linear-gradient(right, "+ theme.volumeColor.start +", "+ theme.volumeColor.end +")",
                "background": "-moz-linear-gradient(right, "+ theme.volumeColor.start +", "+ theme.volumeColor.end +")",
                "background": "linear-gradient(to right, "+ theme.volumeColor.start +", "+ theme.volumeColor.end +")",
            });
            $(".lauwen-audio-tools-rate").css({
                "background-color": theme.rateColor.bg,
                "color": theme.rateColor.font,
                "border-color": theme.rateColor.border,
            })
        },
        audioPlayOrPause : function () {
            var self = this;
            $(document).on("click", ".lauwen-audio-play", function () {
                if ($(this).hasClass('glyphicon-play')) {
                    self.audio.get(0).play();
                    $(this).removeClass('glyphicon-play');
                    $(this).addClass('glyphicon-pause');
                }else if ($(this).hasClass('glyphicon-pause')) {
                    self.audio.get(0).pause();
                    $(this).removeClass('glyphicon-pause');
                    $(this).addClass('glyphicon-play');
                }
            })
        },
        audioMuted : function () {
            var self = this;
            $(document).on("click", ".lauwen-audio-muted", function () {
                if ($(this).hasClass('glyphicon-volume-off')) {
                    self.audio.get(0).muted = false;
                    $(this).removeClass('glyphicon-volume-off');
                    $(this).addClass('glyphicon-volume-up');
                }else if ($(this).hasClass('glyphicon-volume-up')) {
                    self.audio.get(0).muted = true;
                    $(this).removeClass('glyphicon-volume-up');
                    $(this).addClass('glyphicon-volume-off');
                }
            })
        },
        audioRate : function () {
            var self = this;
            $(document).on("change", ".lauwen-audio-tools-rate", function () {
                if ($(this).val() != 0) {
                    self.audio.get(0).playbackRate = $(this).val();
                }
            })
        },
        controlProgressBar : function (lauwen_box_width) {
            var lauwen_progress_status = false;
            var lauwen_audio_obj = this.audio.get(0);
            var self = this;
            $(document).on('click', '.lauwen-audio-progress', function (e) {
                var lauwen_bar_width = e.pageX - $(this).offset().left;
                lauwen_bar_width = (lauwen_bar_width > lauwen_box_width ) ? lauwen_box_width  : lauwen_bar_width;
                lauwen_bar_width = (lauwen_bar_width < 0) ? 0 : lauwen_bar_width;
                $(this).find('.lauwen-audio-progress-bar').css('width', lauwen_bar_width);
                lauwen_audio_obj.currentTime = ((lauwen_bar_width / lauwen_box_width) * lauwen_audio_obj.duration).toFixed(2);
            })
            $(document).on('mousedown', '.lauwen-audio-progress', function (e) {
                lauwen_progress_status = true;
            })
            $(document).on('mouseup', '.lauwen-audio-progress', function (e) {
                lauwen_progress_status = false;
            })
            $(document).on('mousemove', '.lauwen-audio-progress-container', function (e) {
                if (lauwen_progress_status) {
                    var lauwen_bar_width = e.pageX -  $('.lauwen-audio-progress').offset().left;
                    lauwen_bar_width = (lauwen_bar_width > lauwen_box_width ) ? lauwen_box_width  : lauwen_bar_width;
                    lauwen_bar_width = (lauwen_bar_width < 0) ? 0 : lauwen_bar_width;
                    $(this).find('.lauwen-audio-progress-bar').css('width', lauwen_bar_width);
                    var lauwen_audio_want_time = Math.floor((lauwen_bar_width / lauwen_box_width) * lauwen_audio_obj.duration);
                    $(document).find(".lauwen-audio-info-time").text(self.changeSecondToTime(lauwen_audio_want_time) + '/' + self.changeSecondToTime(lauwen_audio_obj.duration));
                } 
            })
            $(document).on('mouseleave', '.lauwen-audio-progress-container', function (e) {
                lauwen_progress_status = false;
            })
            $(document).on('mouseup', '.lauwen-audio-progress-container', function (e) {
                if (lauwen_progress_status) {
                    var lauwen_bar_width = e.pageX -  $('.lauwen-audio-progress').offset().left;
                    lauwen_audio_obj.currentTime = ((lauwen_bar_width / lauwen_box_width) * lauwen_audio_obj.duration).toFixed(2);
                }
                lauwen_progress_status = false;
            })
            lauwen_audio_obj.addEventListener('timeupdate', function (e) {
                if (!lauwen_progress_status){
                    var lauwen_audio_current_time = lauwen_audio_obj.currentTime;
                    var lauwen_audio_duration = lauwen_audio_obj.duration;
                    $(".lauwen-audio-info-time").text(self.changeSecondToTime(lauwen_audio_current_time) + '/' + self.changeSecondToTime(lauwen_audio_duration));
                    var lauwen_temp_bar_width = (lauwen_audio_current_time / lauwen_audio_duration) * lauwen_box_width;
                    $(document).find('.lauwen-audio-progress-bar').css('width', lauwen_temp_bar_width);
                }
            })
        },
        controlVolumeBar : function (lauwen_volume_box_width) {
            var lauwen_volume_status = false;
            var lauwen_audio_obj = this.audio.get(0);
            $(document).on('mousedown', '.lauwen-audio-volume', function (e) {
                lauwen_volume_status = true;
                var lauwen_volume_bar_width = e.pageX - $(this).offset().left;
                lauwen_volume_bar_width = (lauwen_volume_bar_width > lauwen_volume_box_width) ? lauwen_volume_box_width : lauwen_volume_bar_width;
                lauwen_volume_bar_width = (lauwen_volume_bar_width < 0) ? 0 : lauwen_volume_bar_width;
                $(this).find('.lauwen-audio-volume-bar').css('width', lauwen_volume_bar_width);
                lauwen_audio_obj.volume = (lauwen_volume_bar_width / lauwen_volume_box_width ).toFixed(2);
            })
            $(document).on('mouseup', '.lauwen-audio-volume', function (e) {
                lauwen_volume_status = false;
            })
            $(document).on('mousemove', '.lauwen-audio-control-container', function (e) {
                if (lauwen_volume_status) {
                    var lauwen_volume_bar_width = e.pageX -  $('.lauwen-audio-volume').offset().left;
                    lauwen_volume_bar_width = (lauwen_volume_bar_width > lauwen_volume_box_width) ? lauwen_volume_box_width : lauwen_volume_bar_width;
                    lauwen_volume_bar_width = (lauwen_volume_bar_width < 0) ? 0 : lauwen_volume_bar_width;
                    $(this).find('.lauwen-audio-volume-bar').css('width', lauwen_volume_bar_width);
                    lauwen_audio_obj.volume = (lauwen_volume_bar_width / lauwen_volume_box_width).toFixed(2);
                } 
            })
            $(document).on('mouseleave', '.lauwen-audio-control-container', function (e) {
                lauwen_volume_status = false;
            })
            $(document).on('mouseup', '.lauwen-audio-control-container', function (e) {
                lauwen_volume_status = false;
            })
        },
        changeSecondToTime : function (value) {
            var second = parseInt(value);// 秒
            var minute = 0;
            var hour = 0;
            if(second > 59) {
                minute = parseInt(second / 60);
                second = parseInt(second % 60);
                if(minute > 59) {
                    hour = parseInt(minute / 60);
                    minute = parseInt(minute % 60);
                }
            }
            if(second > 0) {
                second = (second < 10) ? (":0" + second) : (":" + second);
            }else{
                second = ":00";
            }
            if(minute > 0) {
                minute = (minute < 10) ? ("0" + minute) : minute;
            }else{
                minute = "00";
            }
            if(hour > 0) {
                hour = (hour < 10) ? ("0" + hour + ":") : (hour + ":");
            }else{
                hour = "";
            }
            var result = hour + minute + second;
            return result;
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