// http://arturadib.com/hello-backbonejs/docs/5.html
(function($){
  // `Backbone.sync`: Overrides persistence storage with dummy function. This enables use of `Model.destroy()` without raising an error.
  Backbone.sync = function(method, model, success, error){
    success();
  }

  var Item = Backbone.Model.extend({
    defaults: {
      part1: 'hello',
      part2: 'world'
    }
  });

  var List = Backbone.Collection.extend({
    model: Item
  });

  var ItemView = Backbone.View.extend({
    tagName: 'li', // name of tag to be created
    // `ItemView`s now respond to two clickable actions for each `Item`: swap and delete.
    events: {
      'click span.swap':  'swap',
      'click span.delete': 'remove',
      'click span.highlight': 'highlight'
    },
    // `initialize()` now binds model change/removal to the corresponding handlers below.
    initialize: function(){
      _.bindAll(this, 'render', 'unrender', 'swap', 'remove', 'highlight'); // every function that uses 'this' as the current object should be in here

      this.model.bind('change', this.render);
      this.model.bind('remove', this.unrender);
      this.model.bind('change', this.highlight);
    },
    // `render()` now includes two extra `span`s corresponding to the actions swap and delete.
    render: function(){
      $(this.el).html('<span class="string1">'+this.model.get('part1')+ ' </span>'+'<span class="string2">'+this.model.get('part2')+'</span> &nbsp; &nbsp; <span class="swap" >[swap]</span> <span class="delete">[delete]</span><span class="highlight">[highlight]</span>');
      return this; // for chainable calls, like .render().el
    },
    // `unrender()`: Makes Model remove itself from the DOM.
    unrender: function(){
      $(this.el).remove();
    },
    // `swap()` will interchange an `Item`'s attributes. When the `.set()` model function is called, the event `change` will be triggered.
    swap: function(){
      var swapped = {
        part1: this.model.get('part2'),
        part2: this.model.get('part1')
      };
      this.model.set(swapped);
    },
    // `remove()`: We use the method `destroy()` to remove a model from its collection. Normally this would also delete the record from its persistent storage, but we have overridden that (see above).
    remove: function(){
      this.model.destroy();
    },

    highlight: function(){
      $(this.el).addClass("string-hightlight");
    }
  });

  // Because the new features (swap and delete) are intrinsic to each `Item`, there is no need to modify `ListView`.
  var ListView = Backbone.View.extend({
    el: $('body'), // el attaches to existing element
    events: {
      'click button#add': 'addItem'
    },
    initialize: function(){
      _.bindAll(this, 'render', 'addItem', 'appendItem'); // every function that uses 'this' as the current object should be in here

      this.collection = new List();
      this.collection.bind('add', this.appendItem); // collection event binder

      this.counter = 0;
      this.render();
    },
    render: function(){
      var self = this;
      $(this.el).append("<button id='add'>Add list item</button>");
      $(this.el).append("<ul></ul>");
      _(this.collection.models).each(function(item){ // in case collection is not empty
        self.appendItem(item);
      }, this);
    },
    addItem: function(){
      this.counter++;
      var item = new Item();
      item.set({
        part2: item.get('part2') + this.counter // modify item defaults
      });
      this.collection.add(item);
    },
    appendItem: function(item){
      var itemView = new ItemView({
        model: item
      });
      $('ul', this.el).append(itemView.render().el);
    }
  });

  var listView = new ListView();
})(jQuery);


// http://arturadib.com/hello-backbonejs/docs/4.html
// displays button - (uses model for string data) when click, a string is appended with counter
// This example illustrates how to delegate the rendering of a Model to a dedicated View
// (function($){

//   var Item = Backbone.Model.extend({
//     defaults: {
//       part1: 'hello',
//       part2: 'world again...'
//     }
//   });

//   var List = Backbone.Collection.extend({
//     model: Item
//   });

//     var ItemView = Backbone.View.extend({
//     tagName: 'li', // name of (orphan) root tag in this.el
//     initialize: function(){
//       _.bindAll(this, 'render'); // every function that uses 'this' as the current object should be in here
//     },
//     render: function(){
//       $(this.el).html('<span>'+this.model.get('part1')+' '+this.model.get('part2')+'</span>');
//       return this; // for chainable calls, like .render().el
//     }
//   });

//   var ListView = Backbone.View.extend({
//     el: $('body'), // el attaches to existing element
//     events: {
//       'click button#add': 'addItem'
//     },
//     initialize: function(){
//       _.bindAll(this, 'render', 'addItem', 'appendItem'); // every function that uses 'this' as the current object should be in here

//       this.collection = new List();
//       this.collection.bind('add', this.appendItem); // collection event binder

//       this.counter = 0;
//       this.render();
//     },
//     render: function(){
//       var self = this;
//       $(this.el).append("<button id='add'>Add list item</button>");
//       $(this.el).append("<ul></ul>");
//       _(this.collection.models).each(function(item){ // in case collection is not empty
//         self.appendItem(item);
//       }, this);
//     },
//     addItem: function(){
//       this.counter++;
//       var item = new Item();
//       item.set({
//         part2: item.get('part2') + this.counter // modify item defaults
//       });
//       this.collection.add(item);
//     },

//     appendItem: function (item) {
//       var itemView = new ItemView({
//         model: item
//       });
//       $('ul', this.el).append(itemView.render().el);
//     }

//   });

//   var listView = new ListView();
// })(jQuery);

// http://arturadib.com/hello-backbonejs/docs/3.html
// displays button - (uses model for string data) when click, a string is appended with counter

// (function($){

//   var Item = Backbone.Model.extend({
//     defaults: {
//       part1: 'hello',
//       part2: 'world again...'
//     }
//   });

//   var List = Backbone.Collection.extend({
//     model: Item
//   });

//   var ListView = Backbone.View.extend({
//     el: $('body'), 

//     events: {
//       'click button#add': 'addItem'
//     },

//     initialize: function(){
//       _.bindAll(this, 'render', 'addItem', 'appendItem');

//       this.collection = new List();
//       this.collection.bind('add', this.appendItem);

//       this.counter = 0;
//       this.render();
//     },


//     render: function(){
//       var self = this;
//       $(this.el).append("<button id='add'>Add list item</button>");
//       $(this.el).append("<ul></ul>");
//       _(this.collection.models).each(function(item){
//         self.append(item);
//       }, this);
//     },

//     addItem: function() {
//       this.counter ++;
//       var item = new Item();
//       item.set({
//         part2: item.get('part2') + this.counter
//       });
//       this.collection.add(item);
//     },

//     appendItem: function (item) {
//       $('ul', this.el).append("<li>" + item.get('part1') + " " + item.get('part2') +" </li>");
//     }

//   });

//   var listView = new ListView();
// })(jQuery);



// http://arturadib.com/hello-backbonejs/docs/2.html
// displays button - when click, a string is appended with counter
// (function($){

//   var ListView = Backbone.View.extend({
//     el: $('body'), // attaches `this.el` to an existing element.

//     events: {
//       'click button#add': 'addItem'
//     },

//     initialize: function(){
//       _.bindAll(this, 'render'); // fixes loss of context for 'this' within methods

//       this.counter = 0;
//       this.render(); // not all views are self-rendering. This one is.
//     },


//     render: function(){
//       $(this.el).append("<button id='add'>Add list item</button>");
//       $(this.el).append("<ul></ul>");
//     },

//     addItem: function() {
//       this.counter ++;
//       $('ul', this.el).append("<li>hello world again " + this.counter+ "</li>");
//     }

//   });

//   var listView = new ListView();
// })(jQuery);

// http://arturadib.com/hello-backbonejs/docs/1.html
// displays the string 'hello world' in a li tag
// (function($){

//   var ListView = Backbone.View.extend({
//     el: $('body'), // attaches `this.el` to an existing element.

//     events: {
//       'click button#add': 'addItem'
//     },

//     initialize: function(){
//       _.bindAll(this, 'render'); // fixes loss of context for 'this' within methods

//       this.counter = 0;
//       this.render(); // not all views are self-rendering. This one is.
//     },


//     render: function(){
//       $(this.el).append("<ul> <li>hello world</li> </ul>");
//     }
//   });

//   var listView = new ListView();
// })(jQuery);