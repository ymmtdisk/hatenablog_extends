if(typeof HatenaBookmarkCommentWidget!=="undefined")
{
	// iframeの高さ取得をbodyタグからdivタグへ変更
	HatenaBookmarkCommentWidget.prototype.resizeIframeAll = function () {
	    var frame_list = document.getElementsByClassName('hatena-bookmark-comment-embed');

	    for (var i = 0; i < frame_list.length; i++) {
	        var iframe_documents = frame_list[i].contentWindow.document;
	        var page_height = iframe_documents.getElementsByClassName("hatena-bookmark-comment")[0].offsetHeight + 3; // box-shadow出すために3px大きくする
	        frame_list[i].style.height = page_height + 'px';
	    }
	};
}
jQuery(function($){
	// console.log(location.protocol+"//"+location.hostname+location.pathname);

	var ua = navigator.userAgent;
	if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
		ua = "mobile";
	} else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
		ua = "tablet";
	} else {
		ua = "pc";
	}

	// [PC・スマホ]サイト上の画像の保存をできる限り阻止する対策法 | hi-posi Front-End blog http://hi-posi.co.jp/tech/?p=232
	$("img").on("contextmenu", function(){return false;});

	/**
	 * ある要素の内容が、要素のみであればtrue、テキスト含む場合はfalseを返すfunction
	 * hタグやliタグの内容がaタグだけで記述されているかを判定するために作成
	 */
	$.fn.isFullOfElements = function() {
		var innerText = this.get(0).innerText;
		var childrensText = "";
		this.children().each(function(j, obj){
			childrensText += $(obj).text();
		});
		return innerText==childrensText;
	}

	/**
	 * hostnameを判別して、外部サイトへのリンクは新しいタブで開く
	 */
	$('a[href^=http]')
			.not('[href*="'+location.hostname+'"]')
			.attr({target:"_blank"})
			.addClass("external_link");
	$("a").click(function(){
		var href = $(this).attr('href');
		if(href.indexOf('http') == -1){
		}else if(href.indexOf('blog.ymmtdisk.jp') == 0){
		}else{
			ga('send', 'event', 'link' ,'click', href, 1);
		}
	});

	/**
	 * #で始まるリンクをクリックしたら実行されます
	 * http://code-life.hatenablog.com/entry/2015/10/19/225957
	 */
	$('a[href^=#]').click(function() {
		// スクロールの速度
		var speed = 400; // ミリ秒で記述
		var href= $(this).attr("href");
		var target = $(href == "#" || href == "" ? 'html' : href);
		var adjust = 0;
		if($("#header")) {
			if(ua=="pc") { adjust = -40; }
			else { adjust = 0; }
		}
		var position = target.offset().top + adjust;
		$('body,html').animate({scrollTop:position}, speed, 'swing');
		return false;
	});

	/**
	 * h3で区切られた領域で、ulにcssクラスを指定
	 * 20160829 previewでも表示が変わるように修正
	 */
	//$("body.page-entry article .entry-content h2, body.page-preview article .entry-content h2, body.page-preview-draft article .entry-content h2").each(function(i,h2){
	$("body[class^='page-entry'] article .entry-content h3, body[class^='page-preview'] article .entry-content h3").each(function(i,header){
		switch(header.innerText) {
			case "words of week" :
				$(header).next("ul").addClass('words_of_week');
				break;
			case "ニュース" :
			case "今週のニュース" :
			case "その他のニュース" :
			case "今週のネットサーフィン" :
			case "今週のウェブサーフィン" :
				$(header).nextAll("ul").addClass('topics').find("li").addClass('topic-item');
				break;
		}
	});

	/**
	 * # ニュースリンクの表示を加工
	 * 20140709 要素の先頭リンクだけを加工する仕組みに修正
	 * -20140730 はてブ数を表示 http://h2plus.biz/hiromitsu/entry/484
	 * 20140910 functionに分離
	 * 20141001 参考・関連リンクを入れ子にリストにしたため、はてブ画像作成処理を分離
	 * 20151218 .post以下のHタグにも対応。リンクないものは除外
	 * 20160203 Hタグ・LIタグが要素のみ(aタグを想定)であればはてブ画像を設置するように修正。->文中のリンクには設置しない。
	 * 20160217 ul.topics以下のliタグは対象とする
	 * 20160219 ul.topics以下のliタグで、コメント付きの場合はアイコンをつける
	 * # 特定のaタグにはてブ画像を設置
	 * 20160127 要素内のリンクについては、.post以下のすべてにはてブ画像を設置するように修正。
	 * 20160203 Hタグ・LIタグが要素のみ(aタグを想定)であればはてブ画像を設置するように修正。->文中のリンクには設置しない。
	 * 20160819 hrefがundefinedかアンカーリンクの場合は除外
	 * # 統合
	 * 20171027 上記をすべて統合
	 */
	$(".entry-content h3, .entry-content h4, .entry-content h5, .entry-content h6, .entry-content li.topic-item").each(function(i, obj)
	{
		var $obj = $(obj);
		if(!$obj.is("li") && !$obj.isFullOfElements()) return; // 内容が要素のみでなければ次へ
		if(!$obj.find("a").length) return; // aタグがなければ次へ

		var $item = $($obj.find("a").get(0));
		$block = format_link($item);
		if($obj.is("li") && $obj.hasClass('topic-item') && !$obj.isFullOfElements()) {
			$item.after($("<i/>", {class: 'fa fa-comment-o'}).clone());
		}

		if($item.attr("href")===undefined || $item.attr("href").match(/^#/))
		{}
		else
		{
			if($item.parent())
			if($item.parent().isFullOfElements())
			{
				$block.find("a").after(hateb($item.attr("href")));
			}
		}
		$item.replaceWith($block);
	});

	/**
	 * リンクを整形
	 * 20151222 タグの構成を修正
	 */
	function format_link( $item )
	{
		var url = $item.attr("href");
		var url_s = url_short(url);

		$block = $("<span/>").addClass('topics_block');
		$block.append(
			$("<span/>").addClass('topics_title').html($item.html())
			);
		$item.html(url_s);
		$item.next("br").remove();
		$block//.append("<br>")
			.append(
			$("<span/>").addClass('link_url').append($item.clone())
			);
		return $block;
	}

	/**
	 * UserAgentの端末に合わせてURLの文字数制限
	 */
	function url_short( url )
	{
		var url_short = url;
		// UserAgent見てスマートフォンならURLの文字数制限をする
		if(ua=="mobile" || ua=="tablet")
		{
			limit = 32;
		}
		else
		{
			limit = 64;
		}
		if(url.length > limit){
			url_short = url.slice(0, limit);
			url_short = url_short + "...";
		}
		return url_short;
	}

	/**
	 * はてブ画像作成
	 * 20140730 はてブ数を表示 http://h2plus.biz/hiromitsu/entry/484
	 */
	function hateb( url ) {
		// http://iwb.jp/jquery-abbr-text/
		if(url.match(/^\//)) {
			url+='http://blog.ymmtdisk.jp';
		}
		var hateb_api = 'http://b.hatena.ne.jp/entry/';
		var $hateb_icon = $('<img />', { src: hateb_api+'image/' + url });
		return $('<a/>', { href: hateb_api + url, class: 'hateb_link', target: '_blank' }).append($hateb_icon);
	}

	/**
	 * Markdownの脚注をツールチップで表示
	 * 20151222 ライブラリ依存しないように修正
	 * 20160120 smallipopでの表示は廃止
	 * CSSやJavaScriptでツールチップを表示させる方法まとめ | アンギス http://unguis.cre8or.jp/web/1934
	 */
	$("sup[id^=fnref]").each(function(i,sup){
		$ref = $($(sup).find("a").get(0));
		var $note = $(".footnotes "+$ref.attr("href"));
		$ref.attr("title", $note.text().slice(0,$note.text().length-2)).text("["+$ref.text()+"]");
	});

	/**
	 * Googleフォトの画像を装飾
	 */
	if($("#main img.magnifiable"))
	{
		$("#main img.magnifiable").parent("span").parent("li").parent("ul").addClass('image-list');
		$("#main img.magnifiable").parent("p > span").addClass('image-span');
	}

	// jQueryで複数リストの要素を並べ替える - hatena chips http://hatenachips.blog34.fc2.com/blog-entry-385.html
	$.fn.eachsort = function(cb) {
		return this.each(function(){
			return $(this).html(
				$(this).children().sort(cb)
			);
		});
	}
	var $categories = $("<ul/>").addClass('hatena-urllist').addClass('mb-10');
	var $groups = $("<ul/>").addClass('hatena-urllist').addClass('mb-10');
	var $tags = $("<ul/>").addClass('hatena-urllist').addClass('mb-10');
	var $others = $("<ul/>").addClass('hatena-urllist');
	$(".hatena-module.hatena-module-category .hatena-module-body .hatena-urllist li a, .categories a, span[itemprop='title'], .archive-header-category .archive-heading, .breadcrumb-child span").each(function(i, a){
		$a = $(a);
		$a.text(jQuery.trim($a.text()));
		$switch = "";
		if($a.text().match(/^cat\:/)) {
			$a.text($a.text().replace(/^cat\:/, ""));
			$a.addClass('hatena-cat-icon');
			$switch="cat";
		}
		else if($a.text().match(/^group\:/)) {
			$a.text($a.text().replace(/^group\:/, ""));
			$a.addClass('hatena-group-icon');
			$switch="group";
		}
		else if($a.text().match(/^tag\:/)) {
			$a.text($a.text().replace(/^tag\:/, ""));
			$a.addClass('hatena-tag-icon');
			$switch="tag";
		}
		else {
			return;
			// $a.addClass('hatena-tag-icon');
		}
		if($match = $a.text().match(/\(([\d]+)\)/)) {
			$a.attr("entry-count", $match[1]);
			if($switch=="cat") {
				$categories.append($("<li/>").attr("entry-count", $match[1]).append($a.clone()));
			}
			else if($switch=="group") {
				$groups.append($("<li/>").attr("entry-count", $match[1]).append($a.clone()));
			}
			else if($switch=="tag") {
				$tags.append($("<li/>").attr("entry-count", $match[1]).append($a.clone()));
			}
			else {
				$others.append($("<li/>").attr("entry-count", $match[1]).append($a.clone()));
			}
		}
	});
	if($categories.children().length==0)
	{
		$categories = null;
	}
	if($groups.children().length==0)
	{
		$groups = null;
	}
	if($tags.children().length==0)
	{
		$tags = null;
	}
	if($others.children().length==0)
	{
		$others = null;
	}
	// $categories.eachsort(function(a, b) {
	// 	return parseInt($(b).attr('entry-count'), 10) - parseInt($(a).attr('entry-count'), 10);
	// });
	// $tags.eachsort(function(a, b) {
	// 	return parseInt($(b).attr('entry-count'), 10) - parseInt($(a).attr('entry-count'), 10);
	// });
	$(".hatena-module.hatena-module-category .hatena-module-body .hatena-urllist").after($others).after($tags).after($groups).replaceWith($categories);

	if($("dd div.info a.subscriber"))
	{
		$("dd div.info a.subscriber").each(function(i, a){
			$a = $(a);
			$img = $($a.find("img").get(0));
			$span = $("<span/>").addClass('subscriber-id').text("id:"+$img.attr("title"));
			$a.append($span);
		});
	}

	/**
	 * フッターに配置した広告を、最初のHRの位置に配置
	 */
	if($("#js-hatena-content-ad") && $("#content #main div.entry-content hr"))
	{
		var hr = $("#content #main div.entry-content hr").get(0);
		var $hr = $(hr);
		$hr.before($("#js-hatena-content-ad"));
	}
	/**
	 * 記事下プロフィールを.customized-footerの先頭へ
	 */
	if($(".customized-footer .article-bottom-profile"))
	{
		//var $related_articles = $(".customized-footer");
		//$related_articles.prepend($(".customized-footer .article-bottom-profile"));
	}

});
