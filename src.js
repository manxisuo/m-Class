var ArrayProto = Array.prototype;

function Class(methods) {
    var constructor = methods.constructor;
    var cls = function () {
        constructor.apply(this, arguments);
    };

    delete methods.constructor;

    for (var name in methods) {
        cls.prototype[name] = methods[name];
    }

    return cls;
}

Class.extend = function (father) {
    return function (methods) {
        var constructor = methods.constructor;
        var cls = function () {
            if (constructor === Object) {
                father.apply(this, arguments);
            }
            else {
                ArrayProto.unshift.call(arguments, father.bind(this));
                constructor.apply(this, arguments);
            }
        };
        var $super = {};

        delete methods.constructor;

        cls.__proto__ = father;
        cls.prototype = Object.create(father.prototype);
        cls.prototype.constructor = cls;

        for (var name in methods) {
            (function (name) {
                cls.prototype[name] = function () {
                    if (!$super._initialized) {
                        $super._initialized = true;
                        for (var name2 in father.prototype) {
                            $super[name2] = father.prototype[name2].bind(this);
                        }
                    }

                    ArrayProto.unshift.call(arguments, $super);
                    return methods[name].apply(this, arguments);
                }
            })(name);
        }

        return cls;
    }
};
