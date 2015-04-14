addSample("tree.setModel", {
  javascript: function () {
    // The Data model could looks like :
    var model = {
      "root": {
        "id": "1",
        "name": "/",
        "children": [
          {"name": "Folder1_1", "id": "2"},
          {"name": "Folder1_2", "id": "3"},
          {
            "name": "Folder1_3", "id": "4",
            "children": [
              {"name": "Folder1_3_1", "id": "5"}
            ]
          }
        ]
      }
    };
  }
});

