var UICommonWidget = {
    create_tab: function (btn_list, page_list, init_page, belong_page, btn_func) {
        // Desc. 创建一个Table需要一组按钮作为标签，和对应的页数
        // Args. btn_list与page_list长度需要一致；init_page是初始页；belong_page可指向一个翻页page作为父控件也可以为nil；btn_func需要有一个参数，参数为按钮编号
        // Ret . table对象，记录了标签需要的所有信息
        // Noti. 初始化时会调用初始页init_page对应的btn_func
        if (btn_list.length != page_list.length) {
            // error("create_tab wrong arguments!")
            return null;
        }

        // 标记编号
        for (var i = 0; i < btn_list.length; i++) {
            btn_list[i].btn_id = i;
        }

        for (var i = 0; i < page_list.length; i++) {
            page_list[i].page_id = i;
            //[[默认隐藏滚动条中的内容
            if (page_list[i].getDescription() === "ScrollView") {
                var item_list = page_list[i].getChildren();
                for (var j = 1; j < item_list.length; j++) {
                    item_list[j].setVisible(false);
                }
            }
            // ]]
        }

        // 如果tab为翻页形式，将滚动层都加入到翻页层中
        if (belong_page) {
            // for (var i = 0; i < page_list.length; i++) {
            //     page_list[i].setAnchorPoint(0, 0);
            //     page_list[i].setPosition(0, 0);
            //     page_list[i].retain();
            //     page_list[i].removeFromParent();
            //     belong_page.addPage(page_list[i]);
            //     page_list[i].release();
            // }

            function select_page_event(sender, eventType) {
                if (eventType === ccui.PageView.EVENT_TURNING) {
                    var cur_page_index = sender.getCurPageIndex();
                    // var cur_page_index = sender.getCurPageIndex() + 1
                    if (btn_func) {
                        btn_func(cur_page_index);
                    }
                    for (var i = 0; i < btn_list.length; i++) {
                        if (i === cur_page_index) {
                            btn_list[i].setBright(false);
                            btn_list[i].setTouchEnabled(false);
                        } else {
                            btn_list[i].setBright(true);
                            btn_list[i].setTouchEnabled(true);
                        }
                    }
                }
            }

            belong_page.addEventListener(select_page_event);
        }

        function select_btn_event(sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                if (btn_func) {
                    btn_func(sender.btn_id);
                }
                for (var i = 0; i < btn_list.length; i++) {
                    if (i === sender.btn_id) {
                        btn_list[i].setBright(false);
                        btn_list[i].setTouchEnabled(false);
                    } else {
                        btn_list[i].setBright(true);
                        btn_list[i].setTouchEnabled(true);
                    }
                }
                if (belong_page) {
                    // TODO. LZR可能存在内存问题
                    belong_page.scrollToPage(sender.btn_id)
                } else {
                    for (var i = 0; i < page_list.length; i++) {
                        if (i === sender.btn_id) {
                            page_list[i].setVisible(true);
                        } else {
                            page_list[i].setVisible(false);
                        }
                    }
                }
            }
        }

        for (var i = 0; i < btn_list.length; i++) {
            btn_list[i].addTouchEventListener(select_btn_event);
        }
        // 设置初始页
        init_page = init_page || 0;
        for (var i = 0; i < btn_list.length; i++) {
            if (i === init_page) {
                btn_list[i].setBright(false);
                btn_list[i].setTouchEnabled(false);
            } else {
                btn_list[i].setBright(true);
                btn_list[i].setTouchEnabled(true);
            }
        }
        if (belong_page) {
            // scrollToPage会执行默认标签的按钮响应
            belong_page.scrollToPage(init_page);
            for (var i = 0; i < page_list.length; i++) {
                page_list[i].setVisible(true);
            }
        } else {
            // 需手动执行默认标签的按钮响应
            if (btn_func) {
                btn_func(init_page);
            }
            for (var i = 0; i < page_list.length; i++) {
                if (i === init_page) {
                    page_list[i].setVisible(true);
                } else {
                    page_list[i].setVisible(false);
                }
            }
        }
        // 返回一个表作为tab的对象
        return {"btn_list": btn_list, "page_list": page_list, "belong_page": belong_page, "btn_func": btn_func};
    },

    change_to_tab: function (tab_obj, page_no) {
        // Desc. 辅助上述table切换标签
        // Args. tab_obj为create_tab返回的对象，page_no为要切换到的页数
        // Ret . 执行成功或失败
        if (page_no >= (tab_obj["btn_list"]).length || page_no < 0) {
            return false;
        }
        var btn_list = tab_obj["btn_list"];
        var page_list = tab_obj["page_list"];
        var belong_page = tab_obj["belong_page"];
        var btn_func = tab_obj["btn_func"];

        for (var i = 0; i < btn_list.length; i++) {
            if (i === page_no) {
                btn_list[i].setBright(false);
                btn_list[i].setTouchEnabled(false);
            } else {
                btn_list[i].setBright(true);
                btn_list[i].setTouchEnabled(true);
            }
        }
        if (belong_page) {
            belong_page.scrollToPage(page_no);
        } else {
            for (var i = 1; i < page_list.length; i++) {
                if (i === page_no) {
                    page_list[i].setVisible(true);
                } else {
                    page_list[i].setVisible(false);
                }
            }
        }
        // 执行默认标签的按钮相应
        if (btn_func) {
            btn_func(page_no);
        }
        return true;
    },
    create_list_view: function (cur_listview, info_list, update_func) {
        // Desc. 以cur_listview中自带的唯一一个子控件为模板，根据info_list中的数据和update_func方法创建#info_list个item
        // Args. cur_listview中包含一个子结点作为列表容器的item，update_func是一个方法，两个参数第一个参数为item第二个参数为对应的item_info, 第三个参数为当前index
        // Ret . listview对象，记录了标签需要的所有信息

        if (!cur_listview  || !update_func) {
            return null
        }
        //每页存放的个数
        var scroll_content_size = cur_listview.getContentSize();
        var item_model = cur_listview.getChildren();
        var item_content_size = item_model[0].getContentSize();
        var pageSum = 0 ,
            last_page_num = 0 ;

        var num_page = Math.floor(scroll_content_size.height / item_content_size.height);
        if (num_page <= 0){
            return null
        }
        if (info_list && info_list.length > 0){
            pageSum = (info_list.length % num_page === 0) ? info_list.length / num_page : Math.floor(info_list.length / num_page) + 1;
            last_page_num = Math.floor(info_list.length % num_page);
        }
        cur_listview.setItemModel(item_model[0]);
        cur_listview.removeAllItems();
        for (var i = 0; i < num_page; i++) {
            cur_listview.pushBackDefaultItem();
        }
        for (var i = 0; i < num_page; i++) {
            var item = cur_listview.getItem(i);
            item.setVisible(true);
            if (!info_list || info_list.length <= i) {
                item.setVisible(false);
            } else {
                update_func(item, info_list[i], i, i);
            }
        }
        // 返回一个表作为listview的对象
        return {"info_list": info_list, "num_page": num_page, "pageSum": pageSum, "last_page_num": last_page_num};
    },
    change_to_listpage: function (cur_listview, listview_obj, page_no, update_func) {
        // Desc. 辅助上述listView切换标签
        // Args. cur_listview为create_list_view传入的列表控件，listview_obj为create_list_view返回的对象，page_no为要切换到的页数
        // update_func是一个方法，两个参数第一个参数为item第二个参数为对应的item_info, 第三个参数为当前页面第几项，第四个参数是总数的第几项
        // Ret . 执行成功或失败
        if (page_no > (listview_obj["pageSum"]) || page_no <= 0 || !listview_obj["info_list"]) {
            return false;
        }
        var info_list = listview_obj["info_list"];
        var num_page = listview_obj["num_page"];
        var pageSum = listview_obj["pageSum"];
        var last_page_num = (listview_obj["last_page_num"] == 0) ? num_page:listview_obj["last_page_num"];

        for (var i = 0; i < num_page; i++) {
            var item = cur_listview.getItem(i);
            item.setVisible(true);
            if (i >= last_page_num && page_no === pageSum) {
                item.setVisible(false);
            } else {
                update_func(item, info_list[(page_no - 1) * num_page + i], i, (page_no - 1) * num_page + i);
            }
        }
        return true;
    },

    update_scroll_items: function (cur_scroll, item_info_list, update_func, need_more, more_func) {
        // Desc. 以滚动条cur_scroll中自带的唯一一个子控件为模板，根据item_info_list中的数据和update_func方法创建#item_info_list个item
        // Args. cur_scroll中包含一个子结点作为滚动条的item，update_func是一个方法，两个参数第一个参数为item第二个参数为对应的item_info, 第三个参数为当前index
        // Ret . 无
        if (need_more) {
            var item_list = cur_scroll.getChildren();
            var more_label = item_list[item_list.length - 1].clone();
            item_list[item_list.length - 1].removeFromParent();
            item_list[item_list.length - 1] = null;
            // 设置滚动区域大小
            var scroll_content_size = cur_scroll.getContentSize();
            var item_content_size = item_list[0].getContentSize();
            var more_label_size = more_label.getContentSize();
            var inner_width = undefined;
            var inner_height = undefined;
            if (cur_scroll.getDirection() === ccui.ScrollView.DIR_HORIZONTAL) {
                inner_height = item_content_size.height;
                inner_width = (item_info_list.length) * item_content_size.width + more_label_size.width;
            } else {
                inner_width = item_content_size.width;
                inner_height = (item_info_list.length) * item_content_size.height + more_label_size.height;
            }
            if (inner_height < cur_scroll.getContentSize().height) {
                inner_height = cur_scroll.getContentSize().height;
            }
            if (inner_width < cur_scroll.getContentSize().width) {
                inner_width = cur_scroll.getContentSize().width;
            }
            cur_scroll.setInnerContainerSize(cc.size(inner_width, inner_height));

            for (var i = 0; i < item_info_list.length; i++) {
                if (!item_list[i]) {
                    // item_list[i] = item_list[0].clone();
                    var cur_item = item_list[0].clone();
                    cur_scroll.addChild(cur_item);
                }
                item_list[i].setVisible(true);
                //摆放位置
                //var cur_content_size = self.g_MTT_page_list[cur_page_index].getContentSize()
                if (cur_scroll.getDirection() === ccui.ScrollView.DIR_HORIZONTAL) {
                    item_list[i].setPosition(cc.p(i * item_content_size.width, 0));
                } else {
                    item_list[i].setPosition(cc.p(0, inner_height - (i + 1) * item_content_size.height));
                }
                //更新数据
                // update_func(item_list[i], item_info_list[i], i);
            }
            for (var i = 0; i < item_info_list.length; i++) {
                //更新数据
                update_func(item_list[i], item_info_list[i], i);
            }

            if (item_info_list.length < item_list.length) {
                // item多余时处理
                for (var i = item_list.length - 1; i >= item_info_list.length; i--) {
                    if (i === 0) {
                        item_list[i].setVisible(false);
                    } else {
                        item_list[i].removeFromParent();
                        item_list[i] = undefined;
                        //item_list[i].setVisible(false)
                    }
                }
                if (item_info_list.length > 1) {
                    item_list.length = item_info_list.length;
                } else {
                    item_list.length = 1;
                }
            }

            cur_scroll.addChild(more_label);
            if (cur_scroll.getDirection() === ccui.ScrollView.DIR_HORIZONTAL) {
                // TODO
                // more_label.setPosition(cc.p((i - 1) * item_content_size.width+more_label_size.width, 0));
            } else {
                more_label.setPosition(cc.p(0, inner_height - (item_info_list.length) * item_content_size.height - more_label_size.height));
            }
            more_label.setString("查看更多玩家");
            more_label.setVisible(true);
            more_label.addTouchEventListener(more_func);
            if (item_info_list.length + const_val.RANK_EACH_NUM > 100) {
                more_label.setVisible(false);
            }
        } else {
            var item_list = cur_scroll.getChildren();
            // 设置滚动区域大小
            var scroll_content_size = cur_scroll.getContentSize();
            var item_content_size = item_list[0].getContentSize();
            var inner_width = undefined;
            var inner_height = undefined;
            if (cur_scroll.getDirection() === ccui.ScrollView.DIR_HORIZONTAL) {
                inner_height = item_content_size.height;
                inner_width = (item_info_list.length) * item_content_size.width;
            } else {
                inner_width = item_content_size.width;
                inner_height = (item_info_list.length) * item_content_size.height;
            }
            if (inner_height < cur_scroll.getContentSize().height) {
                inner_height = cur_scroll.getContentSize().height;
            }
            if (inner_width < cur_scroll.getContentSize().width) {
                inner_width = cur_scroll.getContentSize().width;
            }
            cur_scroll.setInnerContainerSize(cc.size(inner_width, inner_height));

            var offpos = item_list[0].getPosition();
            var offsetx = offpos.x;
            var offsety = offpos.y;
            for (var i = 0; i < item_info_list.length; i++) {
                if (!item_list[i]) {
                    if ((cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) || (cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative)) {
                        item_list[i] = item_list[0].clone();
                        cur_scroll.addChild(item_list[i]);
                    } else {
                        var cur_item = item_list[0].clone();
                        cur_scroll.addChild(cur_item);
                    }
                }
                item_list[i].setVisible(true);
                //摆放位置
                //var cur_content_size = self.g_MTT_page_list[cur_page_index].getContentSize()
                if (cur_scroll.getDirection() === ccui.ScrollView.DIR_HORIZONTAL) {
                    item_list[i].setPosition(cc.p(i * item_content_size.width, offsety));
                } else {
                    item_list[i].setPosition(cc.p(offsetx, inner_height - (i + 1) * item_content_size.height));
                }
                //更新数据
                // update_func(item_list[i], item_info_list[i], i);
            }
            for (var i = 0; i < item_info_list.length; i++) {
                //更新数据
                update_func(item_list[i], item_info_list[i], i);
            }
            if (item_info_list.length < item_list.length) {
                // item多余时处理
                for (var i = item_list.length - 1; i >= item_info_list.length; i--) {
                    if (i === 0) {
                        item_list[i].setVisible(false);
                    } else {
                        item_list[i].removeFromParent();
                        item_list[i] = undefined;
                        //item_list[i].setVisible(false)
                    }
                }
                if (item_info_list.length > 1) {
                    item_list.length = item_info_list.length;
                } else {
                    item_list.length = 1;
                }
            }
        }
    },

    // add_scroll_item: function (cur_scroll, cur_item) {
    //     // Desc. 与update_scroll_items类似，向滚动条cur_scroll中增加一个cur_item
    //     // Args. cur_scroll目标滚动条，初始化滚动范围要与大小一致，cur_item是实际对象不会被clone，复制item对象和填写item都需要在方法外进行
    //     // Ret . 无
    //     var content_size = cur_scroll.getContentSize();
    //     var inner_size = cur_scroll.getInnerContainerSize();
    //     var cur_item_size = cur_item.getContentSize();
    //     if (cur_scroll.getDirection() === cc.SCROLLVIEW_DIRECTION_HORIZONTAL) {
    //         if (inner_size.width > content_size.width) {
    //             // 滚动范围比显示区域大，代表已填满一页，可以直接增加滚动范围添加item
    //             cur_scroll.setInnerContainerSize(cc.size(inner_size.width + cur_item_size.width, inner_size.height));
    //             cur_item.removeFromParent();
    //             cur_scroll.addChild(cur_item);
    //             cur_item.setPosition(cc.p(inner_size.width, 0));
    //         } else {
    //             // 滚动范围跟显示区域一样大，新增物体后可能小于一页，也可能大于一页，需要分开处理
    //             var item_list = cur_scroll.getChildren();
    //             var last_item_pos = 0;
    //             for (var i = 0; i < item_list.length; i++) {
    //                 if (item_list[i].isVisible() && item_list[i] !== cur_item) {
    //                     if (item_list[i].getPositionX() + item_list[i].getContentSize().width > last_item_pos) {
    //                         last_item_pos = item_list[i].getPositionX() + item_list[i].getContentSize().width;
    //                     }
    //                 }
    //             }
    //             if (last_item_pos + cur_item_size.width > content_size.width) {
    //                 // 增加新item后将超过一页
    //                 cur_scroll.setInnerContainerSize(cc.size(last_item_pos + cur_item_size.width, inner_size.height));
    //             }
    //             // 横向的滚动条由于以左侧为锚点，并不需要移动之前已经排布好的item
    //             cur_item.removeFromParent();
    //             cur_scroll.addChild(cur_item);
    //             cur_item.setPosition(cc.p(last_item_pos, 0));
    //         }
    //     } else {
    //         if (inner_size.height > content_size.height) {
    //             // 滚动范围比显示区域大，代表已填满一页，可以直接增加滚动范围添加item
    //             cur_scroll.setInnerContainerSize(cc.size(inner_size.width, inner_size.height + cur_item_size.height));
    //             var item_list = cur_scroll.getChildren();
    //             for (var i = 0; i < item_list.length; i++) {
    //                 if (item_list[i].isVisible()) {
    //                     item_list[i].setPosition(cc.p(item_list[i].getPositionX(), item_list[i].getPositionY() + cur_item_size.height));
    //                 }
    //             }
    //             cur_item.removeFromParent();
    //             cur_scroll.addChild(cur_item);
    //             cur_item.setPosition(cc.p(0, 0));
    //         } else {
    //             // 滚动范围跟显示区域一样大，新增物体后可能小于一页，也可能大于一页，需要分开处理
    //             var item_list = cur_scroll.getChildren();
    //             var last_item_pos = content_size.height;
    //             for (var i = 0; i < item_list.length; i++) {
    //                 if (item_list[i].isVisible() && item_list[i] !== cur_item) {
    //                     if (item_list[i].getPositionY() < last_item_pos) {
    //                         last_item_pos = item_list[i].getPositionY();
    //                     }
    //                 }
    //             }
    //             if (last_item_pos < cur_item_size.height) {
    //                 // 增加新item后将超过一页
    //                 cur_scroll.setInnerContainerSize(cc.size(inner_size.width, inner_size.height + cur_item_size.height - last_item_pos));
    //                 for (var i = 0; i < item_list.length; i++) {
    //                     if (item_list[i].isVisible()) {
    //                         item_list[i].setPosition(cc.p(item_list[i].getPositionX(), item_list[i].getPositionY() + cur_item_size.height - last_item_pos));
    //                     }
    //                 }
    //                 cur_item.removeFromParent();
    //                 cur_scroll.addChild(cur_item);
    //                 cur_item.setPosition(cc.p(0, 0));
    //             } else {
    //                 // 增加新item后仍不足一页
    //                 cur_item.removeFromParent();
    //                 cur_scroll.addChild(cur_item);
    //                 cur_item.setPosition(cc.p(0, last_item_pos - cur_item_size.height));
    //             }
    //         }
    //     }
    //     cur_item.setVisible(true);
    // },
    //
    // create_btn_array: function (btn_list, btn_func, init_btn_num) {
    //     // Desc. 为一组按钮btn_list创建关联关系，一个被按下其他按钮会被重启提起
    //     // Args. btn_func需要有一个参数，参数为按钮标号
    //     // 标记编号
    //     for (var i = 0; i < btn_list.length; i++) {
    //         btn_list[i].btn_id = i;
    //     }
    //     function player_num_select_event(sender, eventType) {
    //         if (eventType === ccui.Widget.TOUCH_ENDED) {
    //             btn_func(sender.btn_id);
    //             for (var i = 0; i < btn_list.length; i++) {
    //                 if (i === sender.btn_id) {
    //                     btn_list[i].setBright(false);
    //                     btn_list[i].setTouchEnabled(false);
    //                 } else {
    //                     btn_list[i].setBright(true);
    //                     btn_list[i].setTouchEnabled(true);
    //                 }
    //             }
    //         }
    //     }
    //
    //     for (var i = 0; i < btn_list.length; i++) {
    //         btn_list[i].addTouchEventListener(player_num_select_event);
    //     }
    //     // 设置初始按钮
    //     init_btn_num = init_btn_num || 1;
    //     for (var i = 0; i < btn_list.length; i++) {
    //         if (i === init_btn_num) {
    //             btn_list[i].setBright(false);
    //             btn_list[i].setTouchEnabled(false);
    //         } else {
    //             btn_list[i].setBright(true);
    //             btn_list[i].setTouchEnabled(true);
    //         }
    //     }
    // },

    // set_wordart:function(img_list, wordart_name, digits){
    //     // Desc. 将固定的img_list中的ImageView从低到高作为数字位数显示digits的数字，wordart_name指定字体，位数超出将会截断高位
    //     // Ret . 无
    //     var wordart_root = "res/img/wordart/";
    //     for (var i = 0; i < img_list.length; i++) {
    //         var cur_img = img_list[i];
    //         if (digits < 1) {
    //             if (i === 1) {
    //                 cur_img.loadTexture(wordart_root + wordart_name + "/" + wordart_name + "_0.png");
    //             }else{
    //                 cur_img.setVisible(false);
    //             }
    //         }else if (digits > 100000000 && i === 1) {
    //             cur_img.loadTexture(wordart_root + wordart_name + "/" + wordart_name + "_y.png");
    //             digits = math.floor(digits / 100000000);
    //         }else if (digits > 10000 && i === 1) {
    //             cur_img.loadTexture(wordart_root + wordart_name + "/" + wordart_name + "_w.png");
    //             digits = math.floor(digits / 10000);
    //         }else{
    //             cur_img.loadTexture(wordart_root + wordart_name + "/" + wordart_name + "_" + tostring(digits % 10) + ".png");
    //             digits = math.floor(digits / 10);
    //         }
    //     }
    // },

    // create_wordart:function(wordart_name, digits, typeId, interval)
    //     // Desc. 通过wordart子目录wordart_name下的12张图片创建艺术字，主要用于静态字体
    //     // Ret . node子物体为艺术字的图片
    //     typeId = typeId or 0
    //     interval = interval or 0
    //     var wordart_root = "res/img/wordart/"
    //     var node = cc.Node.create()


    //     var function createWordView(node, img_list, width, height, filename)
    //         var cur_img = ccui.ImageView.create()
    //         img_list[#img_list + 1] = cur_img
    //         cur_img.loadTexture(filename)
    //         node.addChild(cur_img)
    //         var content_size = cur_img.getContentSize()
    //         width = width + content_size.width
    //         if content_size.height > height {
    //             height = content_size.height
    //         }
    //         return cur_img, width, height
    //     }
    //     if digits < 1 {
    //         if typeId === 1 { return node }
    //         // 值为0时，仅有一个数字0
    //         var cur_img = ccui.ImageView.create()
    //         cur_img.loadTexture(wordart_root .. wordart_name .. "/"..wordart_name.."_0.png")
    //         var content_size = cur_img.getContentSize()
    //         node.setContentSize(content_size)
    //         cur_img.setPosition(content_size.width/2, content_size.height/2)
    //         node.addChild(cur_img)
    //     else
    //         var img_list = {}
    //         var width, height = 0, 0
    //         var cur_img = nil
    //         var orgindigit = digits
    //         var mark = 0
    //         var filename = ""
    //         if digits >= 100000000 {
    //             mark = 2
    //             digits = math.floor(digits / 100000000)
    //         }else if digits >= 10000 {
    //             mark = 1
    //             digits = math.floor(digits / 10000)
    //         }
    //         if mark > 0 {
    //             if mark === 1 {
    //                 filename = wordart_root .. wordart_name .. "/"..wordart_name.."_w.png"
    //             else
    //                 filename = wordart_root .. wordart_name .. "/"..wordart_name.."_y.png"
    //             }
    //             cur_img, width, height = createWordView(node, img_list, width, height, filename)
    //         }
    //         while digits >= 1 do
    //             filename = wordart_root .. wordart_name .. "/"..wordart_name.."_" .. tostring(digits % 10) .. ".png"
    //             cur_img, width, height = createWordView(node, img_list, width, height, filename)
    //             digits = math.floor(digits / 10)
    //         }
    //         if typeId > 0 {
    //             if orgindigit > 0 {
    //                 filename = wordart_root .. wordart_name .. "/"..wordart_name.."_a.png"
    //             else
    //                 filename = wordart_root .. wordart_name .. "/"..wordart_name.."_s.png"
    //             }
    //             cur_img, width, height = createWordView(node, img_list, width, height, filename)
    //         }
    //         if typeId === 1 {
    //             filename = wordart_root .. wordart_name .. "/"..wordart_name.."_chip.png"
    //             cur_img, width, height = createWordView(node, img_list, width, height, filename)
    //         }else if typeId === 2 {
    //             filename = wordart_root .. wordart_name .. "/"..wordart_name.."_charm.png"
    //             cur_img, width, height = createWordView(node, img_list, width, height, filename)
    //         }else if typeId === 3 {
    //             filename = wordart_root .. wordart_name .. "/"..wordart_name.."_exp.png"
    //             cur_img, width, height = createWordView(node, img_list, width, height, filename)
    //         }else if typeId === 4 {
    //             filename = wordart_root .. wordart_name .. "/"..wordart_name.."_lv.png"
    //             cur_img, width, height = createWordView(node, img_list, width, height, filename)
    //         }
    //         node.setContentSize(cc.size(width, height))
    //         var x_pos = width
    //         for i = 1, #img_list do
    //             var cur_width = img_list[i].getContentSize().width
    //             img_list[i].setPosition(x_pos - cur_width/2, height/2)
    //             x_pos = x_pos - cur_width + interval
    //         }
    //     }

    //     node.setAnchorPoint(0.5, 0.5)
    //     return node
    // }

    // set_hint_red_dot: function (cur_item, is_visible, anchor_x, anchor_y, scale) {
    //     // Desc. 设置当前组件cur_item是否显示提示红点，红点相对cur_item的位置可以用过anchor_x和anchor_y来设置
    //     // Ret . 无
    //     anchor_x = anchor_x || 1.0;
    //     anchor_y = anchor_y || 1.0;
    //     var content_size = cur_item.getContentSize();
    //     var red_dot_img = cur_item.getChildByName("red_dot_img");
    //     if (red_dot_img) {
    //         // 已经创建了提示红点
    //         red_dot_img.setVisible(is_visible);
    //         red_dot_img.setPosition(anchor_x * content_size.width, anchor_y * content_size.height);
    //     } else {
    //         // 未创建过提示红点
    //         if (true === is_visible) {
    //             // 红点显示时才进行创建
    //             red_dot_img = ccui.ImageView.create();
    //             red_dot_img.setName("red_dot_img");
    //             red_dot_img.loadTexture("res/img/red_dot.png");
    //             // var anchor_point = cur_item.getAnchorPoint();
    //             cur_item.addChild(red_dot_img);
    //             red_dot_img.setPosition(anchor_x * content_size.width, anchor_y * content_size.height);
    //         }
    //     }
    //     if (red_dot_img) {
    //         red_dot_img.setScale(scale);
    //     }
    // },
    //
    // create_clipping_single: function (portrait_img, stencil_name) {
    //     // body
    //     var framesize = portrait_img.getContentSize();
    //     var stencil = cc.Sprite.create(stencil_name);//"res/ui/GameHallUI/gamehall_portrait_stencil.png")
    //     stencil.setAnchorPoint(0.5, 0.5);
    //     //stencil.setPosition(x, y)
    //     //var size = stencil.getContentSize()
    //     //stencil.setScaleX(framesize.width / size.width)
    //     //stencil.setScaleY(framesize.height / size.height)
    //
    //     var clipping_node = cc.ClippingNode.create();
    //     clipping_node.setName("clipping_portrait_node");
    //     //clipping_node.setAnchorPoint(0.5, 0.5)
    //     clipping_node.setPosition(portrait_img.getPosition());
    //     clipping_node.setInverted(false);
    //     clipping_node.setAlphaThreshold(0.5);
    //     clipping_node.setStencil(stencil);
    //     //clipping_node.setContentSize(portrait_img.getContentSize())
    //     portrait_img.retain();
    //     var parentNode = portrait_img.getParent();
    //     portrait_img.removeFromParent();
    //     portrait_img.setPosition(0, 0);
    //     clipping_node.addChild(portrait_img);
    //     parentNode.addChild(clipping_node);
    //     portrait_img.release();
    //     //clipping_node.setLocalZOrder(const.MAX_LAYER_NUM)
    //     //parentNode.setLocalZOrder(const.MAX_LAYER_NUM)
    // },
    //
    // create_clipping: function (item_list, stencil_name, stencil_anchor_x, stencil_anchor_y) {
    //     // Desc. 该方法将创建一个clipping_node插入到item_list[0]和它的父节点之间
    //     // Ret . 创建的clipping_node作为方法返回值，可以获取后进行所需要的定制
    //
    //     // 默认stencil的锚点为0, 0
    //     var anchor_point = item_list[0].getAnchorPoint();
    //     stencil_anchor_x = stencil_anchor_x || anchor_point.x;
    //     stencil_anchor_y = stencil_anchor_y || anchor_point.y;
    //     var parent_node = item_list[0].getParent();
    //     var stencil = cc.Sprite.create(stencil_name);
    //     stencil.setAnchorPoint(stencil_anchor_x, stencil_anchor_y);
    //     stencil.setPosition(0, 0);
    //     var clipping_node = cc.ClippingNode.create();
    //     clipping_node.setName("clipping_node");
    //     clipping_node.setPosition(item_list[0].getPositionX(), item_list[0].getPositionY());
    //     clipping_node.setInverted(false);
    //     // clipping_node.setAlphaThreshold(0.5);
    //     clipping_node.setStencil(stencil);
    //     clipping_node.setContentSize(item_list[0].getContentSize());
    //     parent_node.addChild(clipping_node);
    //     for (var i = 0; i < item_list.length; i++) {
    //         item_list[i].retain();
    //         item_list[i].removeFromParent();
    //         clipping_node.addChild(item_list[i]);
    //         item_list[i].release();
    //         if (item_list[i].getPositionType() === ccui.Widget.POSITION_PERCENT) {
    //             item_list[i].setPositionPercent(cc.p(0, 0));
    //         } else {
    //             item_list[i].setPosition(0, 0);
    //         }
    //     }
    //     return clipping_node;
    // },

    load_effect_plist: function (name, multi_num) {
        // Desc. 根据name加载特效所需要的图片
        // Args. name是特效名称，部分分为多张的特效可以通过multi_num制定图片数目
        // Ret . 无
        // Noti. 无
        //    if name === 'effect_gamehall_all' {
        cc.Texture2D.defaultPixelFormat = cc.Texture2D.PIXEL_FORMAT_RGBA4444;
        // cc.Texture2D.setDefaultAlphaPixelFormat(cc.TEXTURE2_D_PIXEL_FORMAT_RGB_A4444);
        //    }
        var cache = cc.spriteFrameCache;
        // var cache = cc.spriteFrameCache.getInstance()
        if (multi_num && multi_num > 0) {
            // var res_list = [];
            // for (var i = 0; i < multi_num; i++) {
            //     res_list.push("res/effect/" + name + i.toString() + ".plist");
            //     res_list.push("res/effect/" + name + i.toString() + ".png");
            // }
            // cc.loader.load(res_list);
            for (var i = 0; i < multi_num; i++) {
                cache.addSpriteFrames("res/effect/" + name + i.toString() + ".plist", "res/effect/" + name + i.toString() + ".png");
            }
        } else {
            var plist_path = "res/effect/" + name + ".plist";
            var png_path = "res/effect/" + name + ".png";

            cache.addSpriteFrames(plist_path, png_path);
        }
        //    if name === 'effect_gamehall_all' {
        // cc.Texture2D.setDefaultAlphaPixelFormat(cc.TEXTURE2_D_PIXEL_FORMAT_RGB_A8888)
        cc.Texture2D.defaultPixelFormat = cc.Texture2D.PIXEL_FORMAT_RGBA8888;
        //    }
    },

    create_effect_action: function (effect_info, info) {
        // Desc. 根据表中的设置创建播放特效的动作
        // Args. effect_info是特效的信息,info设置播放方式
        // Ret . 创建好的特效动作effect_action
        // Noti. 使用前必须使用load_effect_plist加载相关png
        if (!effect_info) {
            return null;
        }
        var cache = cc.spriteFrameCache;
        // var cache = cc.spriteFrameCache.getInstance()
        var anim_frames = [];
        if (effect_info["INFO"] && effect_info["INFO"] === 1) {
            for (var i = effect_info["FRAMENUM"]; i >= 1; i--) {
                var frame = cache.getSpriteFrame(effect_info["NAME"] + i.toString() + ".png");
                if (frame) {
                    anim_frames.push(frame);
                }
            }
        } else {
            for (var i = 1; i <= effect_info["FRAMENUM"]; i++) {
                var frame = cache.getSpriteFrame(effect_info["NAME"] + i.toString() + ".png");
                if (frame) {
                    anim_frames.push(frame);
                }
            }
        }

        // effect_animation.setDelayPerUnit(effect_info["TIME"]/effect_info["FRAMENUM"]);
        // effect_animation.setRestoreOriginalFrame(true);

        var effect_animation = new cc.Animation(anim_frames, effect_info["TIME"] / effect_info["FRAMENUM"]);

        // var effect_animation = cc.Animation.createWithSpriteFrames(anim_frames, effect_info["TIME"]/effect_info["FRAMENUM"]);
        //effect_animation.setDelayPerUnit(2.8 / #effect_animation.getFrames())
        //effect_animation.setRestoreOriginalFrame(true)
        var effect_action = new cc.Animate(effect_animation);
        // var effect_action = cc.Animate.create(effect_animation);
        return effect_action;
    },

    //[[
    // stop_effect: function (effect_sprite, eid) {
    //     // TODO: load
    //     // var table_effect = require("data/table_effect")
    //     var table_info = table_effect[eid];
    //     if (table_info === null || table_info === undefined) {
    //         return;
    //     }
    //     var path = effect_info["PATH"] || "";
    //     effect_sprite.stopAllActions();
    //     effect_sprite.setVisible(false);
    //     cc.spriteFrameCache.removeSpriteFramesFromFile("res/effect/" + path + table_effect[eid]["NAME"] + ".plist");
    // },
    // ]]

    // chips_interval : 10,

    // create_chips:function(parent_node, num, pos_x, pos_y, scale, interval, blinds, stack_num){
    //     interval = interval || this.chips_interval;
    //     blinds = blinds or h1global.entityManager.player().curGame.blinds;
    //     if num < blinds {
    //         num = blinds
    //     }
    //     stack_num = stack_num or 5
    //     var table_bet_chip = require("data/table_bet_chip")
    //     var chips = {}
    //     for i = #table_bet_chip, 1, -1 do
    //         var per_chip_val = blinds * table_bet_chip[i]["TIMES"]
    //         if per_chip_val <= num {
    //             var cur_chip_num = math.floor(num / per_chip_val)
    //             if #chips < stack_num {
    //                 for j = 1, cur_chip_num do
    //                     var chip_img = ccui.ImageView.create()
    //                     chip_img.loadTexture("res/ui/GUI/" .. table_bet_chip[i]["NAME"] .. ".png")
    //                     chip_img.setLocalZOrder(const.MAX_LAYER_NUM)
    //                     chips[#chips + 1] = chip_img
    //                     if scale {
    //                         chips[#chips].setScale(scale)
    //                     }
    //                     if #chips >= stack_num {
    //                         break
    //                     }
    //                 }
    //             }
    //             num = num - per_chip_val * cur_chip_num
    //         }
    //     }
    //     for i = #chips, 1, -1 do
    //         chips[i].setPosition(pos_x, (#chips - i) * interval + pos_y)
    //         parent_node.addChild(chips[i])
    //     }
    //     return chips
    //     // chips按照从大到小进行排列
    // }

    // function UICommonWidget.set_chips_positon(chips, pos_x, pos_y, interval)
    //     interval = interval || this.chips_interval
    //     for i = 1, #chips do
    //         chips[i].setPosition(pos_x, (#chips - i) * interval + pos_y)
    //     }
    // }

    // function UICommonWidget.move_chips_to(chips, to_pos, callback, from_pos, interval)
    //     interval = interval || this.chips_interval
    //     if from_pos {
    //         self.set_chips_positon(chips, from_pos.x, from_pos.y, interval)
    //     }
    //     for i = 1, #chips do
    //         if i === #chips and callback {
    //             chips[i].runAction(cc.Sequence.create(cc.DelayTime.create(i * 0.02), cc.EaseInOut.create(cc.MoveTo.create(0.5, cc.p(to_pos.x, to_pos.y)), 3.0), cc.CallFunc.create(callback)))
    //         else
    //             chips[i].runAction(cc.Sequence.create(cc.DelayTime.create(i * 0.02), cc.EaseInOut.create(cc.MoveTo.create(0.5, cc.p(to_pos.x, to_pos.y + (#chips - i) * interval)), 3.0)))
    //         }
    //         chips[i].runAction(cc.Sequence.create(cc.FadeIn.create(0.2), cc.DelayTime.create(#chips * 0.02 + 0.1), cc.FadeOut.create(0.2)))
    //     }
    // }

    // function UICommonWidget.remove_chips(chips)
    //     for i = 1, #chips do
    //         chips[i].removeFromParent()
    //     }
    //     chips = nil
    // }

    // function UICommonWidget.check_word_jump(base_node)
    //     // body
    //     var tmpList = self.showJumpWordQueue[base_node]
    //     base_node.removeChild(self.word_jump_node[base_node])
    //     self.word_jump_node[base_node] = nil
    //     if #tmpList > 0 {
    //         var item = tmpList[#tmpList]
    //         self.show_word_jump(base_node, item[1], item[2], item[3], item[4])
    //         tmpList[#tmpList] = nil
    //     }
    // }

    // function UICommonWidget.word_jump(base_node, from, to, wordnum, typeId)
    //     if self.showJumpWordQueue === nil { self.showJumpWordQueue = {} }
    //     if self.word_jump_node === nil { self.word_jump_node = {} }
    //     if self.showJumpWordQueue[base_node] === nil { self.showJumpWordQueue[base_node] = {} }


    //     if self.word_jump_node[base_node] === nil { 
    //         self.show_word_jump(base_node, from, to, wordnum, typeId)
    //     else
    //         var tmpList = self.showJumpWordQueue[base_node]
    //         tmpList[#tmpList + 1] = {from, to, wordnum, typeId}
    //     }
    // }

    // function UICommonWidget.show_word_jump(base_node, from, to, wordnum, typeId)
    //     self.word_jump_node[base_node] = self.create_wordart("tablenum", wordnum, typeId, 5)
    //     base_node.addChild(self.word_jump_node[base_node])
    //     self.word_jump_node[base_node].setPosition(from)
    //     var function callback()
    //         self.check_word_jump(base_node)
    //     } 
    //     self.word_jump_node[base_node].runAction(cc.Sequence.create(cc.MoveTo.create(0.7, to), cc.DelayTime.create(2.0), cc.CallFunc.create(callback)))
    // }

    // function UICommonWidget.word_jump_nodelay(base_node, from, to, wordnum, typeId)
    //     var jump_node = self.create_wordart("tablenum", wordnum, typeId, 5)
    //     base_node.addChild(jump_node)
    //     jump_node.setPosition(from)
    //     var function callback()
    //         base_node.removeChild(jump_node)
    //     } 
    //     jump_node.runAction(cc.Sequence.create(cc.MoveTo.create(0.7, to), cc.CallFunc.create(callback)))
    // }

    // function UICommonWidget.createHorizontalItemSlider(itemNum, slide_space, item_panels, chips_panel, isloop, func )
    //     // body
    //     var lastX = 0
    //     var chips_panel_size = chips_panel.getContentSize()

    //     var halfWidth = chips_panel_size.width * 0.5
    //     for i = 1, itemNum do
    //         var width = halfWidth + slide_space * (i-1)
    //         if isloop === true {
    //             if width > chips_panel_size.width/2.0+slide_space*itemNum*0.5 {
    //                 width = width - slide_space * itemNum
    //             }else if width < chips_panel_size.width/2.0-slide_space*itemNum*0.5 {
    //                 width = width + slide_space * itemNum
    //             }
    //         }
    //         item_panels[i].setPosition(width, chips_panel_size.height * 0.5)
    //     }
    //     var function chips_panel_event(sender, eventType)
    //         if eventType === ccui.TouchEventType.began {
    //             var pos = sender.getTouchBeganPosition()

    //             lastX = pos.x
    //         }else if eventType === ccui.TouchEventType.moved {
    //             var pos = sender.getTouchMovePosition()
    //             if isloop === false {
    //                 var bx = item_panels[1].getPositionX()
    //                 var ex = item_panels[itemNum].getPositionX()            
    //                 if bx > halfWidth  or ex < halfWidth { return }
    //             }
    //             for i = 1, itemNum do
    //                 var imagePosX = item_panels[i].getPositionX() + (pos.x - lastX)
    //                 if isloop === true {
    //                     if imagePosX > chips_panel_size.width/2.0+slide_space*itemNum*0.5 {
    //                         imagePosX = imagePosX - slide_space * itemNum
    //                     }else if imagePosX < chips_panel_size.width/2.0-slide_space*itemNum*0.5 {
    //                         imagePosX = imagePosX + slide_space * itemNum
    //                     }
    //                 else
    //                 // check validity
    //                     if imagePosX < -(itemNum-i) * slide_space + halfWidth or imagePosX > (i-1) * slide_space + halfWidth {
    //                        return
    //                     }
    //                 }
    //                 item_panels[i].setPositionX(imagePosX)
    //             }

    //             lastX = pos.x
    //         }else if eventType === ccui.Widget.TOUCH_ENDED or eventType === ccui.TouchEventType.canceled {
    //             // print("ended or canceled")

    //             for i = 1, itemNum do
    //                 var width = item_panels[i].getPositionX()
    //                 var widthToPanelCenter = width - halfWidth

    //                 if widthToPanelCenter%slide_space <= slide_space * 0.5 {
    //                     widthToPanelCenter = widthToPanelCenter - widthToPanelCenter%slide_space
    //                 else
    //                     widthToPanelCenter = widthToPanelCenter + slide_space - widthToPanelCenter%slide_space
    //                 }
    //                 if -1 <= widthToPanelCenter and widthToPanelCenter <= 1 {
    //                     func(i)
    //                 }
    //                 width = widthToPanelCenter + halfWidth
    //                 item_panels[i].runAction(cc.EaseOut.create(cc.MoveTo.create(0.1, cc.p(width, item_panels[i].getPositionY())), 1.5))
    //             }
    //         }
    //     }
    //     chips_panel.addTouchEventListener(chips_panel_event)
    // }

    // function UICommonWidget.moveHorizontalItemSlider(itemNum, slide_space, item_panels, chips_panel, isloop, func, moveX )

    //     var chips_panel_size = chips_panel.getContentSize()
    //     var halfWidth = chips_panel_size.width * 0.5
    //     for i = 1, itemNum do
    //         var imagePosX = item_panels[i].getPositionX() + moveX
    //         if isloop === true {
    //             if imagePosX > chips_panel_size.width/2.0+slide_space*itemNum*0.5 {
    //                 imagePosX = imagePosX - slide_space * itemNum
    //             }else if imagePosX < chips_panel_size.width/2.0-slide_space*itemNum*0.5 {
    //                 imagePosX = imagePosX + slide_space * itemNum
    //             }
    //         else
    //             // check validity
    //             if imagePosX < -(itemNum-i) * slide_space + halfWidth or imagePosX > (i-1) * slide_space + halfWidth {
    //                 return
    //             }
    //         }
    //         item_panels[i].setPositionX(imagePosX)
    //     }

    //     for i = 1, itemNum do
    //         var width = item_panels[i].getPositionX()
    //         var widthToPanelCenter = width - halfWidth

    //         if widthToPanelCenter%slide_space <= slide_space * 0.5 {
    //             widthToPanelCenter = widthToPanelCenter - widthToPanelCenter%slide_space
    //         else
    //             widthToPanelCenter = widthToPanelCenter + slide_space - widthToPanelCenter%slide_space
    //         }
    //         if -1 <= widthToPanelCenter and widthToPanelCenter <= 1 {
    //             func(i)
    //         }
    //         width = widthToPanelCenter + halfWidth
    //         item_panels[i].runAction(cc.EaseOut.create(cc.MoveTo.create(0.1, cc.p(width, item_panels[i].getPositionY())), 1.5))
    //     }
    // }

    // function UICommonWidget.dynamicShowVerticalPanels(panel, item_panels, moveTime, speedTime )
    //     // body
    //     var itemNum = #item_panels
    //     if itemNum === 0 { return }
    //     var height = panel.getContentSize().height
    //     var tempheight = item_panels[1].getContentSize().height

    //     for i = 1, itemNum do
    //         item_panels[i].setPosition(0, height - tempheight * i)
    //     }
    //     if tempheight * itemNum <= height { return }
    //     var countNum = math.ceil(height / tempheight)
    //     var curIndex = 0
    //     var function moveFunc()
    //         curIndex = curIndex + 1
    //         if curIndex > countNum { curIndex = 1 }
    //         // body
    //         for i = 1, itemNum do
    //             var offset = i - curIndex
    //             if offset <= 0 { offset = offset + itemNum }

    //             item_panels[i].setPosition(0, height - tempheight * offset)

    //             if offset <= countNum + 1 {
    //                 var action = cc.EaseOut.create(cc.MoveBy.create(speedTime, cc.p(0, tempheight)), 3.0)
    //                 item_panels[i].runAction(action)
    //             }
    //         }
    //     }
    //     var action = cc.RepeatForever.create(cc.Sequence.create(cc.DelayTime.create(moveTime), cc.CallFunc.create(moveFunc)))
    //     panel.stopAllActions()
    //     panel.runAction(action)
    // }

    // function UICommonWidget.create_edit_box(x, y, width, height, fontsize, maxlength, content, inputFunc)
    //     // body
    //     if content === nil { content = "输入聊天内容" }
    //     if maxlength === nil { maxlength = 25 }
    //     if fontsize === nil { fontsize = 30 }

    //     var inputEditBoxSize = cc.size(width, height)
    //     var inputEditBox = ccui.EditBox.create(inputEditBoxSize, ccui.Scale9Sprite.create("res/ui/GUI/common_blank.png"), nil, nil)
    //     inputEditBox.setName("input_editbox")
    //     inputEditBox.setAnchorPoint(0, 0)
    //     inputEditBox.setPosition(cc.p(x, y))
    //     //判断平台设置字体，不设置字体无法调整字体大小
    //     if cc.PLATFORM_OS_IPHONE === targetPlatform or cc.PLATFORM_OS_IPAD === targetPlatform {
    //         inputEditBox.setFontName("Paint Boy")
    //         inputEditBox.setPlaceholderFontName("Paint Boy")
    //     else
    //         inputEditBox.setFontName("res/ui/Font/simhei.ttf")
    //         inputEditBox.setPlaceholderFontName("res/ui/Font/simhei.ttf")
    //     }
    //     inputEditBox.setFontSize(fontsize)
    //     inputEditBox.setPlaceholderFontSize(fontsize)
    //     inputEditBox.setPlaceHolder(content)
    //     //inputEditBox.setInputMode(cc.EDITBOX_INPUT_MODE_EMAILADDR)
    //     inputEditBox.setInputMode(cc.EDITBOX_INPUT_MODE_ANY)
    //     inputEditBox.setMaxLength(maxlength)
    //     if inputFunc != nil {
    //         inputEditBox.registerScriptEditBoxHandler(inputFunc)
    //     }
    //     return inputEditBox
    // }

    // function UICommonWidget.create_drop_coins(parent_node, coin_num, delayRange)
    //     // 返回金币的list
    //     coin_num = coin_num or 20
    //     var coin_list = {}
    //     var coin_parm_list = {}
    //     self.load_effect_plist("effect_gold_coin")
    //     var effect_info = require("data/table_effect")[7]
    //     var cache = cc.SpriteFrameCache.getInstance()
    //     var frame = cache.getSpriteFrame(effect_info["NAME"] .. "3.png")
    //     if delayRange === nil { delayRange = 1 }
    //     var speed = 3500
    //     var jumpspeed = 600
    //     for i = 1, coin_num do
    //         // 创建coin_num数目的金币Sprite
    //         var delay_time = math.random() * delayRange
    //         var pos_x = math.random()
    //         var pos_y = math.random()
    //         var angle = math.random() * 360
    //         var jump_random = (math.random() - 0.5) * 0.2
    //         var uiheight = UIAnchor.uiSize["height"] * (1.0 + pos_y * 0.1)
    //         var uiweight = UIAnchor.uiSize["width"] * (0.1 + pos_x * 0.8)
    //         var fallheight = UIAnchor.uiSize["height"]
    //         var jumpheight = uiheight * 0.2 * (math.random() * 0.4 + 0.8)
    //         var jumpoffset = uiweight * jump_random
    //         var cur_coin = cc.Sprite.create().setPosition(uiweight, uiheight)
    //         cur_coin.setRotation(angle)
    //         coin_list[#coin_list + 1] = cur_coin
    //         coin_parm_list[#coin_parm_list + 1] = {uiheight, jumpheight, jumpoffset}
    //         parent_node.addChild(cur_coin)
    //         var function callback(fallheight, jumpheight, jumpoffset)
    //             var jumpTimes = 1
    //             cur_coin.runAction(cc.RepeatForever.create(self.create_effect_action(7)))
    //             cur_coin.runAction(cc.RepeatForever.create(cc.RotateBy.create(1.0, 360)))
    //             cur_coin.runAction(cc.Sequence.create(
    //                 cc.EaseIn.create(cc.MoveBy.create(fallheight / speed, cc.p(0, -fallheight)), 1.5), 
    //                 cc.JumpBy.create(jumpheight / jumpspeed * jumpTimes, cc.p(jumpoffset * (jumpTimes + 1) * 0.5, 0), jumpheight, jumpTimes), 
    //                 cc.CallFunc.create(function() cur_coin.stopAllActions() cur_coin.setSpriteFrame(frame) cur_coin.setRotation(90) })
    //                 ))
    //         }
    //         h1global.performWithDelay(cur_coin, function () callback(fallheight, jumpheight, jumpoffset) }, delay_time)
    //     }
    //     return coin_list
    // }

    // function UICommonWidget.adapt_pos_percent(cur_node)
    //     var parent_node = cur_node.getParent()
    //     var cur_node_content_size = cur_node.getContentSize()
    //     var parent_node_content_size = parent_node.getContentSize()
    //     cur_node.setPositionType(ccui.Widget.POSITION_PERCENT)
    //     cur_node.setPositionPercent(cc.p(cur_node_content_size.width/parent_node_content_size.width, cur_node_content_size.height/parent_node_content_size.height))
    // }
    // 
    create_btn_group: function (btn_list, click_func, init_func) {
        for (var i = 0; i < btn_list.length; i++) {
            btn_list[i].btn_id = i;
        }

        if (init_func) {
            for (var i = 0; i < btn_list.length; i++) {
                init_func(btn_list[i]);
            }
        }

        function setBtnState(btn, state) {
            btn.setBright(state);
            btn.setTouchEnabled(state);
        }

        function btn_touch_func(sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                click_func(sender, eventType)
                for (var i = 0; i < btn_list.length; i++) {
                    if (btn_list[i] === sender) {
                        setBtnState(btn_list[i], false);
                    } else {
                        setBtnState(btn_list[i], true);
                    }
                }
            }
        }

        if (click_func) {
            for (var i = 0; i < btn_list.length; i++) {
                btn_list[i].addTouchEventListener(btn_touch_func);
            }
        }
    }
};
