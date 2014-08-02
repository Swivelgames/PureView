var ViewModel = (function(){
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

				var paramArr = this.__params[x],
					newValue = this[x];

				for(var i=0;i<paramArr.length;i++) {
					var param = paramArr[i];

					if(param.value != newValue) {
						param.controller.set(newValue);
					}
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
			if(!this.__params[name]) this.__params[name] = [];

			var that = this,
				paramArr = this.__params[name],

			thisParam = {
				"node": node,
				"value": val,
				"isAttrChild": isAttrChild ? true : false
			};

			thisParam.controller = new ViewModelProperty(node, val, function(){
				var thisParam = that.__params[name];

				if(thisParam.isAttrChild) {
					thisParam.attributeValue = thisParam.attribute.nodeValue;
				}

				thisParam.value = this.get();
			});

			if(isAttrChild!==null) {
				thisParam.attribute = isAttrChild;

				thisParam.__attrWatch = setInterval(function(){
					if(!thisParam.attribute || !thisParam.attribute.nodeValue || !thisParam.attribute.ownerElement) {
						clearInterval(thisParam.__attrWatch);
						console.error("Parent attribute for content item `"+name+"` has been removed");
					}
				},100);
			}

			paramArr.push(thisParam);

			this[name] = val;
		}
	};

	return Constructor;
})();