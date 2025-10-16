






'use strict';

export function loaderOn(loader) {
	loader.classList.add('loader-wrap--active');
}

export function loaderOff(loader) {
	loader.classList.remove('loader-wrap--active');
}