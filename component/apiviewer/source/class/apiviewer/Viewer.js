/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Til Schneider (til132)
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Fabian Jakobs (fjakobs)
     * Jonathan Weiß (jonathan_rass)

************************************************************************ */

/* ************************************************************************


************************************************************************ */

/**
 * The GUI definition of the API viewer.
 *
 * The connections between the GUI components are established in
 * the {@link Controller}.
 *
 * @asset(qx/icon/Tango/22/apps/utilities-dictionary.png)
 * @asset(qx/icon/Tango/22/actions/edit-find.png)
 * @asset(qx/icon/Tango/22/apps/utilities-help.png)
 * @asset(qx/icon/Tango/22/apps/utilities-graphics-viewer.png)
 * @asset(qx/icon/Tango/22/actions/media-seek-forward.png)
 */
qx.Class.define("apiviewer.Viewer",
{
  extend : qx.ui.core.Widget,

  construct : function()
  {
    this.base(qx.ui.core.Widget, "constructor");

    this.__menuItemStore = {};

    var layout = new qx.ui.layout.VBox();
    this.setLayout(layout);

    var tree = new apiviewer.ui.PackageTree();

    this._searchView = new apiviewer.ui.SearchView();

    var legend = new apiviewer.ui.LegendView();
    var toggleView = this.__createToggleView(tree, this._searchView, legend);
    var mainFrame = this.__createDetailFrame();

    this.append(this.__createSplitPane(toggleView, mainFrame), {flex:1});

    // Search for the value of the "search" URL query key.
    var parsedUri = qx.util.Uri.parseUri(location.href);
    if (parsedUri.queryKey && parsedUri.queryKey.search) {
      this._searchView.search(parsedUri.queryKey.search);
      toggleView.setSelection([this._searchView]);
      this.__toggleGroup.setSelection([this.__toggleGroup.getChildren()[1]]);
    }
  },


  members :
  {
    __firstPartHash : null,
    __overflowMenu : null,
    __menuItemStore : null,

    __toggleGroup : null,

    /**
     * Creates the button view widget on the left
     *
     * @param treeWidget {qx.ui.core.Widget} The widget for the "tree" pane
     * @param infoWidget {qx.ui.core.Widget} The widget for the "legend" pane
     * @return {qx.ui.tabview.TabView} The configured button view widget
     */
    __createToggleView : function(treeWidget, searchWidget, infoWidget)
    {
      var stack = new qx.ui.container.Stack();
      stack.setAppearance("toggleview");
      stack.add(treeWidget);
      stack.add(searchWidget);
      stack.add(infoWidget);

      this.__toggleGroup.on("changeSelection", function(e)
      {
        var selected = e.getData()[0];
        var show = selected != null ? selected.getUserData("value") : null;
        switch(show)
        {
          case "packages":
            stack.setSelection([treeWidget]);
            stack.show();
            break;

          case "search":
            stack.setSelection([searchWidget]);
            stack.show();

            /**
             * Delay focussing the text field in case it's html element
             * has no been added to the DOM yet.
             */
            qx.lang.Function.delay(this._onShowSearch, 100, this);
            break;

          case "legend":
            stack.setSelection([infoWidget]);
            stack.show();
            break;

          default:
            stack.exclude();
        }
      },
      this);

      return stack;
    },


    /**
     * Create the detail Frame and adds the Class-, Package and Loader-views to it.
     *
     * @return {qx.ui.layout.CanvasLayout} The detail Frame
     */
    __createDetailFrame : function()
    {
      var detailFrame = new qx.ui.container.Composite(new qx.ui.layout.Canvas);

      detailFrame.getContentElement().setAttribute("class", "content");

      this._detailLoader = new qx.ui.embed.Html('<div style="padding:10px;"><h1><small>please wait</small>Loading data...</h1></div>');
      this._detailLoader.getContentElement().setAttribute("id", "SplashScreen");
      this._detailLoader.setAppearance("detailviewer");

      this._detailLoader.setId("detail_loader");
      detailFrame.add(this._detailLoader, {edge : 0});

      // this._tabView = new apiviewer.DetailFrameTabView();
      this._tabView.setId("tabView");
      this._tabView.exclude();
      detailFrame.add(this._tabView, {edge : 0});

      return detailFrame;
    },


    /**
     * Creates the vertical splitter and populates the split panes
     *
     * @param leftWidget {qx.ui.core.Widget} the widget on the left of the splitter
     * @param rightWidget {qx.ui.core.Widget} the widget on the right of the splitter
     * @return {qx.ui.splitpane.SplitPane} the split pane
     */
    __createSplitPane : function(leftWidget, rightWidget)
    {
      var mainSplitPane = new qx.ui.splitpane.Pane("horizontal");
      mainSplitPane.setAppearance("app-splitpane");
      mainSplitPane.add(leftWidget, 0);
      mainSplitPane.add(rightWidget, 1);
      return mainSplitPane;
    },


    /**
     * Focusses the search view's text field.
     */
    _onShowSearch : function() {
      this._searchView.sinput.focus();
    },


    dispose : function()
    {
      this._classTreeNodeHash = this.__toggleGroup = null;
      this._tree.dispose();
      this._detailLoader.dispose();
      this._classViewer.dispose();
      this._packageViewer.dispose();
      this._searchView.dispose();
      this._tabView.dispose();
    }
  },


  classDefined : function() {
    qx.core.Environment.add("apiviewer.title", "qooxdoo");
    qx.core.Environment.add("apiviewer.initialTreeDepth", 1);
  }
});