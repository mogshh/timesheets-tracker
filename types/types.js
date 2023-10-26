"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionOperator = exports.ConditionVariable = exports.BooleanOperator = void 0;
var BooleanOperator;
(function (BooleanOperator) {
    BooleanOperator["AND"] = "AND";
    BooleanOperator["OR"] = "OR";
})(BooleanOperator || (exports.BooleanOperator = BooleanOperator = {}));
var ConditionVariable;
(function (ConditionVariable) {
    ConditionVariable["windowTitle"] = "windowTitle";
    ConditionVariable["programName"] = "programName";
})(ConditionVariable || (exports.ConditionVariable = ConditionVariable = {}));
var ConditionOperator;
(function (ConditionOperator) {
    ConditionOperator["contains"] = "contains";
    ConditionOperator["doesNotContains"] = "doesNotContains";
    ConditionOperator["isExact"] = "isExact";
    ConditionOperator["isNotExact"] = "isNotExact";
    ConditionOperator["matchesRegex"] = "matchesRegex";
    ConditionOperator["doesNotMatchRegex"] = "doesNotMatchRegex";
})(ConditionOperator || (exports.ConditionOperator = ConditionOperator = {}));
