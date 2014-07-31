PureViews
==========
A "pure" javascript modal library for creating views and managing data bindings.

*NOTICE: For minified, production-ready version, checkout the `master` branch. Those looking for the non-minified, development version can simply grab the `develop` branch instead.*


This library is an example of a VVM (View ViewModel). This library is meant to be integrated into an MVC framework (like Backbone.js) to supply the Controllers, Models, and Drivers.

Specifically, this library is for the live updating of DOM contents based on ViewModelProperty values. When a ViewModelProperty's value is changed, the DOM is immediately updated.

Object.observe() is not used by this library to mitigate issues related to legacy browser support. This library inherently supports older browsers.