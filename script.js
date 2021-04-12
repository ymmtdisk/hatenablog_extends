if (typeof HatenaBookmarkCommentWidget !== "undefined") {
  // iframeの高さ取得をbodyタグからdivタグへ変更
  HatenaBookmarkCommentWidget.prototype.resizeIframeAll = function() {
    var frame_list = document.getElementsByClassName(
      "hatena-bookmark-comment-embed"
    );

    for (var i = 0; i < frame_list.length; i++) {
      var iframe_documents = frame_list[i].contentWindow.document;
      var page_height =
        iframe_documents.getElementsByClassName("hatena-bookmark-comment")[0]
          .offsetHeight + 3; // box-shadow出すために3px大きくする
      frame_list[i].style.height = page_height + "px";
    }
  };
}
jQuery(function($) {
  // console.log(location.protocol+"//"+location.hostname+location.pathname);

  var ua = navigator.userAgent;
  if (
    ua.indexOf("iPhone") > 0 ||
    ua.indexOf("iPod") > 0 ||
    (ua.indexOf("Android") > 0 && ua.indexOf("Mobile") > 0)
  ) {
    ua = "mobile";
  } else if (ua.indexOf("iPad") > 0 || ua.indexOf("Android") > 0) {
    ua = "tablet";
  } else {
    ua = "pc";
  }

  // [PC・スマホ]サイト上の画像の保存をできる限り阻止する対策法 | hi-posi Front-End blog http://hi-posi.co.jp/tech/?p=232
  $("img").on("contextmenu", function() {
    return false;
  });

  /**
   * 括弧の文字列にspan設定
   */
  $(".entry-content p").each(function(){
    var text = $(this).html();
    text = text.replace(/([（\(](?:[^（）\(\)]*|[^（）\(\)]*[（\(][^\)）]*[\)）][^（）\(\)]*)[\)）])/gmi, "<span class=\"parentheses\">$1</span>");
    $(this).html(text);
  });
  
  /**
   * hostnameを判別して、外部サイトへのリンクは新しいタブで開く
   */
  $("a[href^='http']")
    .not('[href*="' + location.hostname + '"]')
    .attr({ target: "_blank" })
    .addClass("external_link");

  /**
   * #で始まるリンクをクリックしたら実行されます
   * http://code-life.hatenablog.com/entry/2015/10/19/225957
   */
  $("a[href^='#']").click(function() {
    // スクロールの速度
    var speed = 400; // ミリ秒で記述
    var href = $(this).attr("href");
    var target = $(href == "#" || href == "" ? "html" : href);
    var adjust = 0;
    if ($("#header")) {
      if (ua == "pc") {
        adjust = -40;
      } else {
        adjust = 0;
      }
    }
    var position = target.offset().top + adjust;
    $("body,html").animate({ scrollTop: position }, speed, "swing");
    return false;
  });

  /**
   * リンクリストにはてブ画像を付加
   * 2019/01/09
   * 2020/02/25 表示仕様を変更。.entry-content全体に適用。
   */
  $(".entry-content a").each(function(i, obj) {
    var $item = $(obj);
    if ($item.attr("href") && $item.attr("href").indexOf("#") == 0) return; // アンカーであれば次へ
    $item.after(hateb($item.attr("href")));
  });

  /**
   * はてブ画像作成
   * 20140730 はてブ数を表示 http://h2plus.biz/hiromitsu/entry/484
   */
  function hateb(url) {
    // http://iwb.jp/jquery-abbr-text/
    if (url.match(/^\//)) {
      url += "https://blog.ymmtdisk.jp";
    }
    var hateb_api = "https://b.hatena.ne.jp/entry/";
    var $hateb_icon = $("<img />", { src: hateb_api + "image/" + url });
    var css_class = "hateb_link ready";
    return $("<a/>", {
      href: hateb_api + url,
      class: css_class,
      target: "_blank"
    }).append($hateb_icon);
  }
  
  /**
   * はてブ0件のときに、aタグをdisplay:none;にする
   */
  $(window).on("load", function(){
    $("a.hateb_link").each(function(i,obj){
      $(obj).removeClass("ready");
      if($(obj).find("img").width()<=1)
      {
        $(obj).hide();
      }
    });	
  });


  /**
   * Markdownの脚注をツールチップで表示
   * 20151222 ライブラリ依存しないように修正
   * 20160120 smallipopでの表示は廃止
   * CSSやJavaScriptでツールチップを表示させる方法まとめ | アンギス http://unguis.cre8or.jp/web/1934
   */
  $("sup[id^=fnref]").each(function(i, sup) {
    $ref = $(
      $(sup)
        .find("a")
        .get(0)
    );
    var $note = $(".footnotes " + $ref.attr("href"));
    $ref
      .attr("title", $note.text().slice(0, $note.text().length - 2))
      .text("[" + $ref.text() + "]");
  });

  /**
   * Googleフォトの画像を装飾
   */
  if ($("#main img.magnifiable")) {
    $("#main img.magnifiable")
      .parent("span")
      .parent("li")
      .parent("ul")
      .addClass("image-list");
    $("#main img.magnifiable")
      .parent("p > span")
      .addClass("image-span");
  }

  if ($("dd div.info a.subscriber")) {
    console.log($("dd div.info a.subscriber"));
    $("dd div.info a.subscriber").each(function(i, a) {
      $a = $(a);
      $img = $($a.find("img").get(0));
      $span = $("<span/>")
        .addClass("subscriber-id")
        .text("id:" + $img.attr("title"));
      $a.append($span);
    });
  }

  /**
   * フッターに配置した広告を、最初のHRの位置に配置
   */
  if ($("#js-hatena-content-ad") && $("#content #main div.entry-content hr")) {
    var hr = $("#content #main div.entry-content hr").get(0);
    var $hr = $(hr);
    $hr.before($("#js-hatena-content-ad"));
  }
  /**
   * 記事下プロフィールを.customized-footerの先頭へ
   */
  if ($(".customized-footer .article-bottom-profile")) {
    var $related_articles = $(".customized-footer");
    $related_articles.prepend($(".customized-footer .article-bottom-profile"));
  }
});
