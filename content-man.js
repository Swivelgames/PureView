var ViewContentManager = (function(){
	var Constructor = function() {
		this.__params = {};

		var that = this;
		setInterval(function(){(function(){
			for(var x in this) {
				if(!this.hasOwnProperty(x) || /^__/.test(x)) continue;

				if(!this.__params.hasOwnProperty(x)) {
					console.warn("Attempting to set content item "+x+" before initializing item with DOM.");
					delete this[x];
					continue;
				}

				var param = this.__params[x],
					newValue = this[x];

				if(param.value != newValue) {
					param.controller.set(newValue);
				}
			}
		}).call(that)},10);
	};

	Constructor.prototype = {
		__params: null,

		keys: function(){
			var ret = [];
			for(var x in this.__params) {
				ret.push(x);
			}
			return ret;
		},

		newItem: function(node, name, val, isAttrChild){
			delete this[name];

			var that = this;
			this.__params[name] = {
				"node": node,
				"value": val,
				"isAttrChild": isAttrChild ? true : false,
				"controller": new ViewContentItem(node, val, function(){
					var thisParam = that.__params[name];

					if(thisParam.isAttrChild) {
						thisParam.attributeValue = thisParam.attribute.nodeValue;
					}

					thisParam.value = this.get();
				})
			};

			if(isAttrChild!==null) {
				var thisParam = this.__params[name];

				thisParam.attribute = isAttrChild;
				thisParam.attributeValue = isAttrChild.nodeValue;

				thisParam.__attrWatch = setInterval(function(){
					if(!thisParam.attribute || !thisParam.attribute.nodeValue || !thisParam.attribute.ownerElement) {
						clearInterval(thisParam.__attrWatch);
						console.error("Parent attribute for content item `"+name+"` has been removed");
					}

					if(thisParam.attribute.nodeValue != thisParam.attributeValue) {
						console.error("DOM attribute modified outside of View; Content item bind lost for `"+name+"`");
					}
				},100);
			}

			this[name] = val;
		}
	};

	return Constructor;
})();