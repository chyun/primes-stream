var currying = function(fn) {
    var args = [].slice.call(arguments, 1);
    return function() {
        var newArgs = args.concat([].slice.call(arguments));
        return fn.apply(null, newArgs);
    };
};

var make_stream = function(start, proc) {
	this.first = start;
	this.proc = proc;
}

var stream_car = function(stream) {
	return stream.first;
}

var stream_cdr = function(stream) {
	return stream.proc();
}

var stream_null = function(stream) {
	if (null == stream || !stream.first){
		return true;
	}
	return false;
}

var stream_filter = function(pred, stream) {
	if (stream_null(stream)) {
		return null;
	} else if (pred(stream_car(stream))) {
		return new make_stream(stream_car(stream), currying(stream_filter, pred, stream_cdr(stream)));
	} else {
		return stream_filter(pred, stream_cdr(stream));
	}
}

var integers_starting_from = function(n) {
	return new make_stream(n, currying(integers_starting_from, n + 1));
} 

var sieve = function(stream) {
	var first = stream_car(stream);
	var dividable = function(x) {
		if ((x % first) == 0) {
			return false;
		}
		return true;
	}
	return new make_stream(first, currying(sieve, stream_filter(dividable, stream_cdr(stream))));
}

var stream_ref = function(stream, n) {
	if (n == 0) {
		return stream_car(stream);
	} else {
		return stream_ref(stream_cdr(stream), n - 1);
	}
}

var primes = sieve(integers_starting_from(2));

var ret = stream_ref(primes, 3);
//console.log(ret);

