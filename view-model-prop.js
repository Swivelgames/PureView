var ViewModelProperty = (function(){
	var Constructor = function(node, value, handler){
		this._node = node;

		this.set(value), this._handler = handler;
	};

	Constructor.prototype = {
		_node: null,
		_value: null,
		_handler: null,

		set: function(val){
			this._value = val;

			this._node.nodeValue = val;

			if(this._handler instanceof Function) this._handler.call(this);

			return this.get();
		},
		get: function(){
			return this.toString();
		},
		toString: function(){
			return this._value;
		}
	}

	return Constructor;
})();