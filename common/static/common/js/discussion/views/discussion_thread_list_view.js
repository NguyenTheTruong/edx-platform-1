/* globals _, Backbone, Content, Discussion, DiscussionUtil */
(function() {
    'use strict';
    var __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key)) {
                    child[key] = parent[key];
                }
            }
            function ctor() {
                this.constructor = child;
            }

            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };

    if (typeof Backbone !== 'undefined' && Backbone !== null) {
        this.DiscussionThreadListView = (function(_super) {
            __extends(DiscussionThreadListView, _super);

            function DiscussionThreadListView() {
                var self = this;
                this.updateEmailNotifications = function() {
                    return DiscussionThreadListView.prototype.updateEmailNotifications.apply(self, arguments);
                };
                this.retrieveFollowed = function() {
                    return DiscussionThreadListView.prototype.retrieveFollowed.apply(self, arguments);
                };
                this.chooseCohort = function() {
                    return DiscussionThreadListView.prototype.chooseCohort.apply(self, arguments);
                };
                this.chooseFilter = function() {
                    return DiscussionThreadListView.prototype.chooseFilter.apply(self, arguments);
                };
                this.keyboardBinding = function() {
                    return DiscussionThreadListView.prototype.keyboardBinding.apply(self, arguments);
                };
                this.filterTopics = function() {
                    return DiscussionThreadListView.prototype.filterTopics.apply(self, arguments);
                };
                this.toggleBrowseMenu = function() {
                    return DiscussionThreadListView.prototype.toggleBrowseMenu.apply(self, arguments);
                };
                this.hideBrowseMenu = function() {
                    return DiscussionThreadListView.prototype.hideBrowseMenu.apply(self, arguments);
                };
                this.showBrowseMenu = function() {
                    return DiscussionThreadListView.prototype.showBrowseMenu.apply(self, arguments);
                };
                this.isBrowseMenuVisible = function() {
                    return DiscussionThreadListView.prototype.isBrowseMenuVisible.apply(self, arguments);
                };
                this.threadRemoved = function() {
                    return DiscussionThreadListView.prototype.threadRemoved.apply(self, arguments);
                };
                this.threadSelected = function() {
                    return DiscussionThreadListView.prototype.threadSelected.apply(self, arguments);
                };
                this.renderThread = function() {
                    return DiscussionThreadListView.prototype.renderThread.apply(self, arguments);
                };
                this.loadMorePages = function() {
                    return DiscussionThreadListView.prototype.loadMorePages.apply(self, arguments);
                };
                this.showMetadataAccordingToSort = function() {
                    return DiscussionThreadListView.prototype.showMetadataAccordingToSort.apply(self, arguments);
                };
                this.renderThreads = function() {
                    return DiscussionThreadListView.prototype.renderThreads.apply(self, arguments);
                };
                this.updateSidebar = function() {
                    return DiscussionThreadListView.prototype.updateSidebar.apply(self, arguments);
                };
                this.addAndSelectThread = function() {
                    return DiscussionThreadListView.prototype.addAndSelectThread.apply(self, arguments);
                };
                this.reloadDisplayedCollection = function() {
                    return DiscussionThreadListView.prototype.reloadDisplayedCollection.apply(self, arguments);
                };
                this.clearSearchAlerts = function() {
                    return DiscussionThreadListView.prototype.clearSearchAlerts.apply(self, arguments);
                };
                this.removeSearchAlert = function() {
                    return DiscussionThreadListView.prototype.removeSearchAlert.apply(self, arguments);
                };
                this.addSearchAlert = function() {
                    return DiscussionThreadListView.prototype.addSearchAlert.apply(self, arguments);
                };
                return DiscussionThreadListView.__super__.constructor.apply(this, arguments);
            }

            DiscussionThreadListView.prototype.events = {
                'keypress .forum-nav-browse-filter-input': function(event) {
                    return DiscussionUtil.ignoreEnterKey(event);
                },
                'keyup .forum-nav-browse-filter-input': 'filterTopics',
                'keydown .forum-nav-browse-filter-input': 'keyboardBinding',
                'click .forum-nav-browse-menu-wrapper': 'ignoreClick',
                'click .forum-nav-browse-title': 'selectTopicHandler',
                'change .forum-nav-sort-control': 'sortThreads',
                'click .forum-nav-thread-link': 'threadSelected',
                'click .forum-nav-load-more-link': 'loadMorePages',
                'change .forum-nav-filter-main-control': 'chooseFilter',
                'change .forum-nav-filter-cohort-control': 'chooseCohort'
            };

            DiscussionThreadListView.prototype.initialize = function(options) {
                var self = this;
                this.courseSettings = options.courseSettings;
                this.displayedCollection = new Discussion(this.collection.models, {
                    pages: this.collection.pages
                });
                this.collection.on('change', this.reloadDisplayedCollection);
                this.discussionIds = '';
                this.collection.on('reset', function(discussion) {
                    var board;
                    board = $('.current-board').html();
                    self.displayedCollection.current_page = discussion.current_page;
                    self.displayedCollection.pages = discussion.pages;
                    return self.displayedCollection.reset(discussion.models);
                });
                this.collection.on('add', this.addAndSelectThread);
                this.collection.on('thread:remove', this.threadRemoved);
                this.sidebar_padding = 10;
                this.boardName = null;
                this.current_search = '';
                this.mode = 'all';
                this.selectedTopicIndex = -1;
                this.selectedTopicId = null;
                this.filterEnabled = true;
                this.selectedTopic = $('.forum-nav-browse-menu-item:visible .forum-nav-browse-title.is-focused');
                this.searchAlertCollection = new Backbone.Collection([], {
                    model: Backbone.Model
                });
                this.searchAlertCollection.on('add', function(searchAlert) {
                    var content;
                    content = edx.HtmlUtils.template($('#search-alert-template').html())({
                        'messageHtml': searchAlert.attributes.message,
                        'cid': searchAlert.cid,
                        'css_class': searchAlert.attributes.css_class
                    });
                    edx.HtmlUtils.append(self.$('.search-alerts'), content);
                    return self.$('#search-alert-' + searchAlert.cid + ' .dismiss')
                        .bind('click', searchAlert, function(event) {
                            return self.removeSearchAlert(event.data.cid);
                        });
                });
                this.searchAlertCollection.on('remove', function(searchAlert) {
                    return self.$('#search-alert-' + searchAlert.cid).remove();
                });
                this.searchAlertCollection.on('reset', function() {
                    return self.$('.search-alerts').empty();
                });
                this.template = edx.HtmlUtils.template($('#thread-list-template').html());
                this.homeTemplate = edx.HtmlUtils.template($('#discussion-home-template').html());
                this.threadListItemTemplate = edx.HtmlUtils.template($('#thread-list-item-template').html());
            };

            /**
             * Creates search alert model and adds it to collection
             * @param message - alert message
             * @param cssClass - Allows setting custom css class for a message. This can be used to style messages
             *                   of different types differently (i.e. other background, completely hide, etc.)
             * @returns {Backbone.Model}
             */
            DiscussionThreadListView.prototype.addSearchAlert = function(message, cssClass) {
                var m;
                m = new Backbone.Model({message: message, css_class: cssClass || ''});
                this.searchAlertCollection.add(m);
                return m;
            };

            DiscussionThreadListView.prototype.removeSearchAlert = function(searchAlert) {
                return this.searchAlertCollection.remove(searchAlert);
            };

            DiscussionThreadListView.prototype.clearSearchAlerts = function() {
                return this.searchAlertCollection.reset();
            };

            DiscussionThreadListView.prototype.reloadDisplayedCollection = function(thread) {
                var active, $content, $currentElement, threadId;
                this.clearSearchAlerts();
                threadId = thread.get('id');
                $content = this.renderThread(thread);
                $currentElement = this.$('.forum-nav-thread[data-id=' + threadId + ']');
                active = $currentElement.has('.forum-nav-thread-link.is-active').length !== 0;
                $currentElement.replaceWith($content);
                this.showMetadataAccordingToSort();
                if (active) {
                    return this.setActiveThread(threadId);
                }
            };

            /*
             TODO fix this entire chain of events
             */

            DiscussionThreadListView.prototype.addAndSelectThread = function(thread) {
                var commentableId = thread.get('commentable_id'),
                    self = this;
                return this.retrieveDiscussion(commentableId, function() {
                    return self.trigger('thread:created', thread.get('id'));
                });
            };

            DiscussionThreadListView.prototype.updateSidebar = function() {
                var amount, browseFilterHeight, discussionBody, discussionBottomOffset, discussionsBodyBottom,
                    discussionsBodyTop, headerHeight, refineBarHeight, scrollTop, sidebar, sidebarHeight, topOffset,
                    windowHeight;
                scrollTop = $(window).scrollTop();
                windowHeight = $(window).height();
                discussionBody = $('.discussion-column');
                discussionsBodyTop = discussionBody[0] ? discussionBody.offset().top : void 0;
                discussionsBodyBottom = discussionsBodyTop + discussionBody.outerHeight();
                sidebar = $('.forum-nav');
                if (scrollTop > discussionsBodyTop - this.sidebar_padding) {
                    sidebar.css('top', scrollTop - discussionsBodyTop + this.sidebar_padding);
                } else {
                    sidebar.css('top', '0');
                }
                sidebarHeight = windowHeight - Math.max(discussionsBodyTop - scrollTop, this.sidebar_padding);
                topOffset = scrollTop + windowHeight;
                discussionBottomOffset = discussionsBodyBottom + this.sidebar_padding;
                amount = Math.max(topOffset - discussionBottomOffset, 0);
                sidebarHeight = sidebarHeight - this.sidebar_padding - amount;
                sidebarHeight = Math.min(sidebarHeight + 1, discussionBody.outerHeight());
                sidebar.css('height', sidebarHeight);
                headerHeight = this.$('.forum-nav-header').outerHeight();
                refineBarHeight = this.$('.forum-nav-refine-bar').outerHeight();
                browseFilterHeight = this.$('.forum-nav-browse-filter').outerHeight();
                this.$('.forum-nav-thread-list')
                    .css('height', (sidebarHeight - headerHeight - refineBarHeight - 2) + 'px');
                this.$('.forum-nav-browse-menu')
                    .css('height', (sidebarHeight - headerHeight - browseFilterHeight - 2) + 'px');
            };

            DiscussionThreadListView.prototype.ignoreClick = function(event) {
                return event.stopPropagation();
            };

            DiscussionThreadListView.prototype.render = function() {
                var self = this;
                this.timer = 0;
                this.$el.empty();
                edx.HtmlUtils.append(
                    this.$el,
                    this.template({
                        isCohorted: this.courseSettings.get('is_cohorted'),
                        isPrivilegedUser: DiscussionUtil.isPrivilegedUser()
                    })
                );
                this.$('.forum-nav-sort-control option').removeProp('selected');
                this.$('.forum-nav-sort-control option[value=' + this.collection.sort_preference + ']')
                    .prop('selected', true);
                $(window).bind('load scroll resize', this.updateSidebar);
                this.displayedCollection.on('reset', this.renderThreads);
                this.displayedCollection.on('thread:remove', this.renderThreads);
                this.displayedCollection.on('change:commentable_id', function() {
                    if (self.mode === 'commentables') {
                        return self.retrieveDiscussions(self.discussionIds.split(','));
                    }
                });
                this.renderThreads();
                this.showBrowseMenu(true);
                return this;
            };

            DiscussionThreadListView.prototype.renderThreads = function() {
                var $content, thread, i, len;
                this.$('.forum-nav-thread-list').empty();
                for (i = 0, len = this.displayedCollection.models.length; i < len; i++) {
                    thread = this.displayedCollection.models[i];
                    $content = this.renderThread(thread);
                    this.$('.forum-nav-thread-list').append($content);
                }
                this.showMetadataAccordingToSort();
                this.renderMorePages();
                this.updateSidebar();
                this.trigger('threads:rendered');
            };

            DiscussionThreadListView.prototype.showMetadataAccordingToSort = function() {
                var voteCounts = this.$('.forum-nav-thread-votes-count'),
                    unreadCommentCounts = this.$('.forum-nav-thread-unread-comments-count'),
                    commentCounts = this.$('.forum-nav-thread-comments-count');
                voteCounts.hide();
                commentCounts.hide();
                unreadCommentCounts.hide();
                switch (this.$('.forum-nav-sort-control').val()) {
                case 'votes':
                    voteCounts.show();
                    break;
                default:
                    unreadCommentCounts.show();
                    commentCounts.show();
                }
            };

            DiscussionThreadListView.prototype.renderMorePages = function() {
                if (this.displayedCollection.hasMorePages()) {
                    edx.HtmlUtils.append(
                        this.$('.forum-nav-thread-list'),
                        edx.HtmlUtils.template($('#nav-load-more-link').html())({})
                    );
                }
            };

            DiscussionThreadListView.prototype.getLoadingContent = function(srText) {
                return edx.HtmlUtils.template($('#nav-loading-template').html())({srText: srText});
            };

            DiscussionThreadListView.prototype.loadMorePages = function(event) {
                var error, lastThread, loadMoreElem, loadingElem, options, _ref,
                    self = this;
                if (event) {
                    event.preventDefault();
                }
                loadMoreElem = this.$('.forum-nav-load-more');
                loadMoreElem.empty();
                edx.HtmlUtils.append(loadMoreElem, this.getLoadingContent(gettext('Loading more threads')));
                loadingElem = loadMoreElem.find('.forum-nav-loading');
                DiscussionUtil.makeFocusTrap(loadingElem);
                loadingElem.focus();
                options = {
                    filter: this.filter
                };
                switch (this.mode) {
                case 'search':
                    options.search_text = this.current_search;
                    if (this.group_id) {
                        options.group_id = this.group_id;
                    }
                    break;
                case 'followed':
                    options.user_id = window.user.id;
                    break;
                case 'commentables':
                    options.commentable_ids = this.discussionIds;
                    if (this.group_id) {
                        options.group_id = this.group_id;
                    }
                    break;
                case 'all':
                    if (this.group_id) {
                        options.group_id = this.group_id;
                    }
                }
                _ref = this.collection.last();
                lastThread = _ref ? _ref.get('id') : void 0;
                if (lastThread) {
                    this.once('threads:rendered', function() {
                        var classSelector =
                            ".forum-nav-thread[data-id='" + lastThread + "'] + .forum-nav-thread " +
                            '.forum-nav-thread-link';
                        return $(classSelector).focus();
                    });
                } else {
                    this.once('threads:rendered', function() {
                        var _ref1 = $('.forum-nav-thread-link').first();
                        return _ref1 ? _ref1.focus() : void 0;
                    });
                }
                error = function() {
                    self.renderThreads();
                    DiscussionUtil.discussionAlert(
                        gettext('Sorry'), gettext('We had some trouble loading more threads. Please try again.')
                    );
                };
                return this.collection.retrieveAnotherPage(this.mode, options, {
                    sort_key: this.$('.forum-nav-sort-control').val()
                }, error);
            };

            DiscussionThreadListView.prototype.renderThread = function(thread) {
                var threadCommentCount = thread.get('comments_count'),
                    threadUnreadCommentCount = thread.get('unread_comments_count'),
                    neverRead = !thread.get('read') && threadUnreadCommentCount === threadCommentCount,
                    context = _.extend(
                        {
                            neverRead: neverRead,
                            threadUrl: thread.urlFor('retrieve')
                        },
                        thread.toJSON()
                    );
                return $(this.threadListItemTemplate(context).toString());
            };

            DiscussionThreadListView.prototype.threadSelected = function(e) {
                var threadId;
                threadId = $(e.target).closest('.forum-nav-thread').attr('data-id');
                this.setActiveThread(threadId);
                this.trigger('thread:selected', threadId);
                return false;
            };

            DiscussionThreadListView.prototype.threadRemoved = function(thread) {
                this.trigger('thread:removed', thread);
            };

            DiscussionThreadListView.prototype.setActiveThread = function(threadId) {
                var $srElem;
                this.$('.forum-nav-thread-link').find('.sr').remove();
                this.$(".forum-nav-thread[data-id!='" + threadId + "'] .forum-nav-thread-link")
                    .removeClass('is-active');
                $srElem = edx.HtmlUtils.joinHtml(
                    edx.HtmlUtils.HTML('<span class="sr">'),
                    edx.HtmlUtils.ensureHtml(gettext('Current conversation')),
                    edx.HtmlUtils.HTML('</span>')
                ).toString();
                this.$(".forum-nav-thread[data-id='" + threadId + "'] .forum-nav-thread-link")
                    .addClass('is-active').find('.forum-nav-thread-wrapper-1')
                    .prepend($srElem);
            };

            DiscussionThreadListView.prototype.goHome = function() {
                var url, $templateContent;
                $templateContent = $(this.homeTemplate().toString());
                $('.forum-content').empty().append($templateContent);
                $('.forum-nav-thread-list a').removeClass('is-active').find('.sr')
                    .remove();
                $('input.email-setting').bind('click', this.updateEmailNotifications);
                url = DiscussionUtil.urlFor('notifications_status', window.user.get('id'));
                DiscussionUtil.safeAjax({
                    url: url,
                    type: 'GET',
                    success: function(response) {
                        $('input.email-setting').prop('checked', response.status);
                    }
                });
            };

            DiscussionThreadListView.prototype.isBrowseMenuVisible = function() {
                return this.$('.forum-nav-browse-menu-wrapper').is(':visible');
            };

            DiscussionThreadListView.prototype.showBrowseMenu = function(initialLoad) {
                if (!this.isBrowseMenuVisible()) {
                    this.$('.forum-nav-browse-menu-wrapper').show();
                    this.$('.forum-nav-thread-list-wrapper').hide();
                    if (!initialLoad) {
                        $('.forum-nav-browse-filter-input').focus();
                        this.filterInputReset();
                    }
                    $('body').bind('click', this.hideBrowseMenu);
                    return this.updateSidebar();
                }
            };

            DiscussionThreadListView.prototype.hideBrowseMenu = function() {
                var selectedTopicList = this.$('.forum-nav-browse-title.is-focused');
                if (this.isBrowseMenuVisible()) {
                    selectedTopicList.removeClass('is-focused');
                    this.$('.forum-nav-browse-menu-wrapper').hide();
                    this.$('.forum-nav-thread-list-wrapper').show();
                    if (typeof this.selectedTopicId !== 'undefined') {
                        this.$('.forum-nav-browse-filter-input').attr('aria-activedescendant', this.selectedTopicId);
                    }
                    $('body').unbind('click', this.hideBrowseMenu);
                    return this.updateSidebar();
                }
            };

            DiscussionThreadListView.prototype.toggleBrowseMenu = function(event) {
                var inputText = $('.forum-nav-browse-filter-input').val();
                event.preventDefault();
                event.stopPropagation();
                if (this.isBrowseMenuVisible()) {
                    return this.hideBrowseMenu();
                } else {
                    if (inputText !== '') {
                        this.filterTopics(inputText);
                    }
                    return this.showBrowseMenu();
                }
            };

            DiscussionThreadListView.prototype.getPathText = function(item) {
                var path, pathTitles;
                path = item.parents('.forum-nav-browse-menu-item').andSelf();
                pathTitles = path.children('.forum-nav-browse-title').map(function(i, elem) {
                    return $(elem).text();
                }).get();
                return pathTitles.join(' / ');
            };

            DiscussionThreadListView.prototype.getBreadcrumbText = function($item) {
                var $parentSubMenus = $item.parents('.forum-nav-browse-submenu'),
                    crumbs = [],
                    subTopic = $('.forum-nav-browse-title', $item)
                        .first()
                        .text()
                        .trim();

                $parentSubMenus.each(function(i, el) {
                    crumbs.push($(el).siblings('.forum-nav-browse-title')
                        .first()
                        .text()
                        .trim()
                    );
                });

                if (subTopic !== 'All Discussions') {
                    crumbs.push(subTopic);
                }

                return crumbs;
            };

            DiscussionThreadListView.prototype.selectOption = function(element) {
                var activeDescendantId, activeDescendantText;
                if (this.selectedTopic.length > 0) {
                    this.selectedTopic.removeClass('is-focused');
                }
                if (element) {
                    element.addClass('is-focused');
                    activeDescendantId = element.parent().attr('id');
                    activeDescendantText = element.text();
                    this.selectedTopic = element;
                    this.selectedTopicId = activeDescendantId;
                    $('.forum-nav-browse-filter-input')
                        .attr('aria-activedescendant', activeDescendantId)
                        .val(activeDescendantText);
                }
            };

            DiscussionThreadListView.prototype.filterInputReset = function() {
                this.filterEnabled = true;
                this.selectedTopicIndex = -1;
                this.selectedTopicId = null;
            };

            DiscussionThreadListView.prototype.keyboardBinding = function(event) {
                var $inputText = $('.forum-nav-browse-filter-input'),
                    $filteredMenuItems = $('.forum-nav-browse-menu-item:visible'),
                    filteredMenuItemsLen = $filteredMenuItems.length,
                    $curOption = $filteredMenuItems.eq(0).find('.forum-nav-browse-title').eq(0),
                    $activeOption, $prev, $next;

                switch (event.keyCode) {
                case 13: {  // enter key
                    $activeOption = $filteredMenuItems.find('.forum-nav-browse-title.is-focused');
                    if ($inputText.val() !== '' && $inputText.focus()) {
                        $activeOption.trigger('click');
                        this.filterInputReset();
                    }
                    break;
                }

                case 27: { // escape key
                    this.toggleBrowseMenu(event);
                    $('.forum-nav-browse-filter-input').val('');
                    this.filterInputReset();
                    $('.all-topics').trigger('click');
                    break;
                }

                case 38: { // up arrow
                    if (this.selectedTopicIndex > -1) {
                        $prev = $('.forum-nav-browse-menu-item:visible')
                            .eq(this.selectedTopicIndex).find('.forum-nav-browse-title')
                            .eq(0);
                        this.selectedTopicIndex -= 1;
                        if (this.isBrowseMenuVisible()) {
                            this.filterEnabled = false;
                            $curOption.removeClass('is-focused');
                            $prev.addClass('is-focused');
                            this.selectOption($prev);
                        } else {
                            this.selectOption($prev);
                        }
                    }
                    break;
                }

                case 40: { // down arrow
                    if (this.selectedTopicIndex < filteredMenuItemsLen - 1) {
                        this.selectedTopicIndex += 1;
                        if (this.isBrowseMenuVisible()) {
                            $next = $('.forum-nav-browse-menu-item:visible')
                                .eq(this.selectedTopicIndex).find('.forum-nav-browse-title')
                                .eq(0);
                            this.filterEnabled = false;
                            $curOption.removeClass('is-focused');
                            $next.addClass('is-focused');
                            this.selectOption($next);
                        } else {
                            this.selectOption($next);
                        }
                    }
                    break;
                }

                default: {
                    break;
                }

                }
                return true;
            };

            DiscussionThreadListView.prototype.filterTopics = function() {
                var items, query,
                    self = this;
                query = this.$('.forum-nav-browse-filter-input').val();
                items = this.$('.forum-nav-browse-menu-item');
                if (query.length === 0) {
                    items.find('.forum-nav-browse-title.is-focused').removeClass('is-focused');
                    return items.show();
                } else {
                    if (this.filterEnabled) {
                        items.hide();
                        return items.each(function(i, item) {
                            var path, pathText,
                                $item = $(item);
                            if (!$item.is(':visible')) {
                                pathText = self.getPathText($item).toLowerCase();
                                if (query.split(' ').every(function(term) {
                                    return pathText.search(term.toLowerCase()) !== -1;
                                })) {
                                    path = $item.parents('.forum-nav-browse-menu-item').andSelf();
                                    return path.add($item.find('.forum-nav-browse-menu-item')).show();
                                }
                            }
                            return items;
                        });
                    }
                }
                return true;
            };

            DiscussionThreadListView.prototype.selectTopicHandler = function(event) {
                event.preventDefault();
                return this.selectTopic($(event.target));
            };

            DiscussionThreadListView.prototype.selectTopic = function($target) {
                var allItems, discussionIds, $item;
                this.hideBrowseMenu();
                $item = $target.closest('.forum-nav-browse-menu-item');

                this.trigger('topic:selected', this.getBreadcrumbText($item));

                if ($item.hasClass('forum-nav-browse-menu-all')) {
                    this.discussionIds = '';
                    this.$('.forum-nav-filter-cohort').show();
                    return this.retrieveAllThreads();
                } else if ($item.hasClass('forum-nav-browse-menu-following')) {
                    this.retrieveFollowed();
                    return this.$('.forum-nav-filter-cohort').hide();
                } else {
                    allItems = $item.find('.forum-nav-browse-menu-item').andSelf();
                    discussionIds = allItems.filter('[data-discussion-id]').map(function(i, elem) {
                        return $(elem).data('discussion-id');
                    }).get();
                    this.retrieveDiscussions(discussionIds);
                    return this.$('.forum-nav-filter-cohort').toggle($item.data('cohorted') === true);
                }
            };

            DiscussionThreadListView.prototype.chooseFilter = function() {
                this.filter = $('.forum-nav-filter-main-control :selected').val();
                return this.retrieveFirstPage();
            };

            DiscussionThreadListView.prototype.chooseCohort = function() {
                this.group_id = this.$('.forum-nav-filter-cohort-control :selected').val();
                return this.retrieveFirstPage();
            };

            DiscussionThreadListView.prototype.retrieveDiscussion = function(discussionId, callback) {
                var url,
                    self = this;
                url = DiscussionUtil.urlFor('retrieve_discussion', discussionId);
                return DiscussionUtil.safeAjax({
                    url: url,
                    type: 'GET',
                    success: function(response) {
                        self.collection.current_page = response.page;
                        self.collection.pages = response.num_pages;
                        self.collection.reset(response.discussion_data);
                        Content.loadContentInfos(response.annotated_content_info);
                        self.displayedCollection.reset(self.collection.models);
                        if (callback) {
                            callback();
                        }
                    }
                });
            };

            DiscussionThreadListView.prototype.retrieveDiscussions = function(discussion_ids) {
                this.discussionIds = discussion_ids.join(',');
                this.mode = 'commentables';
                return this.retrieveFirstPage();
            };

            DiscussionThreadListView.prototype.retrieveAllThreads = function() {
                this.mode = 'all';
                return this.retrieveFirstPage();
            };

            DiscussionThreadListView.prototype.retrieveFirstPage = function(event) {
                this.collection.current_page = 0;
                this.collection.reset();
                return this.loadMorePages(event);
            };

            DiscussionThreadListView.prototype.sortThreads = function(event) {
                this.displayedCollection.setSortComparator(this.$('.forum-nav-sort-control').val());
                return this.retrieveFirstPage(event);
            };

            DiscussionThreadListView.prototype.performSearch = function($searchInput) {
                this.hideBrowseMenu();
                // trigger this event so the breadcrumbs can update as well
                this.trigger('search:initiated');
                this.searchFor($searchInput.val(), $searchInput);
            };

            DiscussionThreadListView.prototype.searchFor = function(text, $searchInput) {
                var url, self = this;
                this.clearSearchAlerts();
                this.clearFilters();
                this.mode = 'search';
                this.current_search = text;
                url = DiscussionUtil.urlFor('search');
                /*
                 TODO: This might be better done by setting discussion.current_page=0 and
                 calling discussion.loadMorePages
                 Mainly because this currently does not reset any pagination variables which could cause problems.
                 This doesn't use pagination either.
                 */

                return DiscussionUtil.safeAjax({
                    $elem: $searchInput,
                    data: {
                        text: text
                    },
                    url: url,
                    type: 'GET',
                    dataType: 'json',
                    $loading: $,
                    loadingCallback: function() {
                        var element = self.$('.forum-nav-thread-list');
                        element.empty();
                        edx.HtmlUtils.append(
                            element,
                            edx.HtmlUtils.joinHtml(
                                edx.HtmlUtils.HTML("<li class='forum-nav-load-more'>"),
                                    self.getLoadingContent(gettext('Loading thread list')),
                                edx.HtmlUtils.HTML('</li>')
                            )
                        );
                    },
                    loadedCallback: function() {
                        return self.$('.forum-nav-thread-list .forum-nav-load-more').remove();
                    },
                    success: function(response, textStatus) {
                        var message, noResponseMsg;
                        if (textStatus === 'success') {
                            self.collection.reset(response.discussion_data);
                            Content.loadContentInfos(response.annotated_content_info);
                            self.collection.current_page = response.page;
                            self.collection.pages = response.num_pages;
                            if (!_.isNull(response.corrected_text)) {
                                noResponseMsg = _.escape(
                                    gettext(
                                        'No results found for {original_query}. ' +
                                        'Showing results for {suggested_query}.'
                                    )
                                );
                                message = edx.HtmlUtils.interpolateHtml(
                                    noResponseMsg,
                                    {
                                        original_query: edx.HtmlUtils.joinHtml(
                                            edx.HtmlUtils.HTML('<em>'), text, edx.HtmlUtils.HTML('</em>')
                                        ),
                                        suggested_query: edx.HtmlUtils.joinHtml(
                                            edx.HtmlUtils.HTML('<em>'),
                                            response.corrected_text,
                                            edx.HtmlUtils.HTML('</em>')
                                        )
                                    }
                                );
                                self.addSearchAlert(message);
                            } else if (response.discussion_data.length === 0) {
                                self.addSearchAlert(gettext('No threads matched your query.'));
                            }
                            self.displayedCollection.reset(self.collection.models);
                            if (text) {
                                return self.searchForUser(text);
                            }
                        }
                    }
                });
            };

            DiscussionThreadListView.prototype.searchForUser = function(text) {
                var self = this;
                return DiscussionUtil.safeAjax({
                    data: {
                        username: text
                    },
                    url: DiscussionUtil.urlFor('users'),
                    type: 'GET',
                    dataType: 'json',
                    error: function() {},
                    success: function(response) {
                        var message, username;
                        if (response.users.length > 0) {
                            username = edx.HtmlUtils.joinHtml(
                                edx.HtmlUtils.interpolateHtml(
                                    edx.HtmlUtils.HTML('<a class="link-jump" href="{url}">'),
                                    {url: DiscussionUtil.urlFor('user_profile', response.users[0].id)}
                                ),
                                response.users[0].username,
                                edx.HtmlUtils.HTML('</a>')
                            );

                            message = edx.HtmlUtils.interpolateHtml(
                                gettext('Show posts by {username}.'), {'username': username}
                            );
                            return self.addSearchAlert(message, 'search-by-user');
                        }
                    }
                });
            };

            DiscussionThreadListView.prototype.clearFilters = function() {
                this.$('.forum-nav-filter-main-control').val('all');
                return this.$('.forum-nav-filter-cohort-control').val('all');
            };

            DiscussionThreadListView.prototype.retrieveFollowed = function() {
                this.mode = 'followed';
                return this.retrieveFirstPage();
            };

            DiscussionThreadListView.prototype.updateEmailNotifications = function() {
                var $checkbox, checked, urlName;
                $checkbox = $('input.email-setting');
                checked = $checkbox.prop('checked');
                urlName = (checked) ? 'enable_notifications' : 'disable_notifications';
                DiscussionUtil.safeAjax({
                    url: DiscussionUtil.urlFor(urlName),
                    type: 'POST',
                    error: function() {
                        $checkbox.prop('checked', !checked);
                    }
                });
            };

            return DiscussionThreadListView;
        }).call(this, Backbone.View);
    }
}).call(window);
