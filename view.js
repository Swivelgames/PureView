/**
 * @class	View
 * @param	{DOM}		DOM		DOM Element or node to parse
 * @param	{Object}	Data 	Data object for initial binding
 * @author	Joseph Dalrymple <me@swivel.in>
 */
var View = (function(){
	/**
	 * @constructor
	 * @param	{DOM}		DOM		DOM Element or node to parse
	 * @param	{Object}	Data 	Data object for initial binding
	 */
	var Constructor = function(DOM, Data) {
		this.dom = DOM;
		this.data = Data || {};

		// Initialize content item mananger
		this.content = new ViewContentManager();

		// Render view
		this.render();
	};

	Constructor.prototype = {
	/**
	 * Instance Properties
	 */
		dom: null,
		data: null,
		content: null,


	/**
	 * @method
	 * @description	To be overwritten by extended prototypes
	 */
		initView: function(){
			// Bind data items to content
			this.setContentUsingData();

			return true;
		},


	/**
	 * Methods
	 */
		render: function(){
			var dom = this.dom,
				contentNodes = this.getContentNodes(dom);

			// Iterate through content nodes
			for(var x=0;x<contentNodes.length;x++) {
				var content = contentNodes[x];

				// Create new binding for content node
				this.content.newItem(content.node, content.name, content.node.nodeValue, content.parentAttribute);
			}

			// Execute generic initView method
			this.initView();
		},

		getContentNodes: function(dom, arr, isAttribute){
			if(arr===void 0) arr = [];

			// Check if dom is element and has attributes
			if(dom.nodeType == document.ELEMENT_NODE && dom.attributes && dom.attributes.length > 0) {
				// Get element's attributes
				var attrs = Array.prototype.slice.apply(dom.attributes);
				for(var x=0;x<attrs.length;x++) {
					// Retrieve content nodes from attributes
					this.getContentNodes(attrs[x], arr, attrs[x]);
				}
			}

			// Is dom a text node?
			if(dom.nodeType===document.TEXT_NODE) {
				// Parse text node to create content node
				this.parseTextNode(dom, arr, isAttribute);
			} else if(dom.childNodes && dom.childNodes.length > 0) {
				// Get node's children
				var children = Array.prototype.slice.apply(dom.childNodes);
				for(var x=0;x<children.length;x++) {
					// Retrieve content nodes from children
					this.getContentNodes(children[x], arr, isAttribute);
				}
			}

			// Return content nodes
			return arr;
		},

		parseTextNode: function(textNode, arr, isAttribute) {
			// If node is not a text node, return
			if(textNode.nodeType!=document.TEXT_NODE) return arr;

			// Split text node's value into separate nodes based on {{$varName}} syntax
			var reg = /\{\{\$[A-Z0-9_-]+\}\}/ig,
				val = textNode.nodeValue,
				split = val.split(reg),
				matches = val.match(reg),
				newNodes = [];

			// Iterate through new nodes
			for(var x=0;x<split.length;x++) {
				// If x is odd number, process next match
				if(x%2 && x>0) {
					var match = matches[x-1],
						matchLen = match.length,
						matchName = match.substring(3,matchLen-2), // Cut out '{{$' and '}}' from match
						matchNode = document.createTextNode(match); // Create new text node based on match

					// Push new node into array
					newNodes.push(matchNode);

					// Push content node onto array
					arr.push({
						name: matchName, // name of content item
						node: matchNode, // node for content item
						parentAttribute: isAttribute || null  // parent attribute, if any
					});
				}

				// Create new text node based off of initial split
				newNodes.push(document.createTextNode(split[x]));
			}

			// If new nodes exist, replace the initial node with them
			if(newNodes.length>0) {
				this.__replaceNode(textNode, newNodes);
			}

			// Return array
			return arr;
		},

		setContentUsingData: function(){
			var data = this.data,
				content = this.content,
				keys = content.keys();

			for(var x=0;x<keys.length;x++) {
				var key = keys[x];

				if(data[key]) {
					content[key] = data[key]
				}
			}
		},


		__addAfter: function(node, newNode) {
			node.parentNode.insertBefore(newNode, node.nextSibling);
		},

		__addBefore: function(node, newNode) {
			node.parentNode.insertBefore(newNode, node);
		},

		__replaceNode: function(oldNode, newNodes) {
			oldNode.nodeValue = newNodes[0].nodeValue;

			var nextElem = oldNode;

			for(var x=1;x<newNodes.length;x++) {
				this.__addAfter(nextElem, newNodes[x]);
				nextElem = newNodes[x];
			}

			return newNodes;
		}
	};

	return Constructor;
})();
