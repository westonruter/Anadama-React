import { EventEmitter } from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/dispatcher';
import AppConstants from '../constants/constants';

import find from 'lodash/collection/find';
import findIndex from 'lodash/array/findIndex';

var CHANGE_EVENT = 'change';

/**
 * Our working post list, read-only
 * @type {array}
 * @protected
 */
var _posts = [];

/**
 * Load this array into our posts list
 *
 * @param {array} data - array of posts, pulled from API
 */
function _loadPosts( data ) {
	_posts = data;
}

/**
 * Load this array into our posts list
 *
 * @param {array} data - array of posts, pulled from API
 */
function _loadPost( id, data ) {
	var key = findIndex( _posts, function( _post ) {
		return parseInt( id ) === parseInt( _post.id );
	} );
	if ( -1 === key ) {
		_posts.push( data );
	}
}

let PostsStore = assign( {}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit( CHANGE_EVENT );
	},

	addChangeListener: function( callback ) {
		this.on( CHANGE_EVENT, callback );
	},

	removeChangeListener: function( callback ) {
		this.removeListener( CHANGE_EVENT, callback );
	},

	/**
	 * Get the post list
	 *
	 * @returns {array}
	 */
	getPosts: function() {
		return _posts;
	},

	/**
	 * Get the current post
	 *
	 * @returns {array}
	 */
	getPost: function( slug ) {
		var post = find( _posts, function( _post ) {
			return slug === _post.slug;
		} );
		post = post || {};
		return post;
	},

	// Watch for store actions, and dispatch the above functions as necessary.
	dispatcherIndex: AppDispatcher.register( function( payload ) {
		var action = payload.action; // this is our action from handleViewAction

		switch ( action.actionType ) {
			case AppConstants.REQUEST_POSTS_SUCCESS:
				_loadPosts( action.data );
				break;
			case AppConstants.REQUEST_POST_SUCCESS:
				_loadPost( action.id, action.data );
				break;
		}

		PostsStore.emitChange();

		return true;
	} )

} );

export default PostsStore;
