"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class for helping define the mapping JWT user Claims to IAM roles
 */
class RoleMapper {
    constructor() {
        this.rules = [];
    }
    /**
     * Use this class to collect the rules to support the role mapping for your IAM users.
     *
     * @param rule @type RoleMapping
     *
     * TODO Create some tests for this class that generates example configuration.
     */
    addMapping(rule) {
        this.rules.push(rule);
    }
    getRules() {
        return this.rules;
    }
}
exports.RoleMapper = RoleMapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sZS1tYXBwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyb2xlLW1hcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBOztHQUVHO0FBQ0gsTUFBYSxVQUFVO0lBSXJCO1FBQ0UsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILFVBQVUsQ0FBQyxJQUFpQjtRQUMxQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBRUQsUUFBUTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0NBQ0Y7QUF0QkQsZ0NBc0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUm9sZU1hcHBpbmcgfSBmcm9tIFwiLi4vbGliL2ludGVyZmFjZXMvUm9sZU1hcHBpbmdcIjtcbi8qKlxuICogQ2xhc3MgZm9yIGhlbHBpbmcgZGVmaW5lIHRoZSBtYXBwaW5nIEpXVCB1c2VyIENsYWltcyB0byBJQU0gcm9sZXNcbiAqL1xuZXhwb3J0IGNsYXNzIFJvbGVNYXBwZXIge1xuXG4gIHJ1bGVzOiBSb2xlTWFwcGluZ1tdO1xuXG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy5ydWxlcyA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSB0aGlzIGNsYXNzIHRvIGNvbGxlY3QgdGhlIHJ1bGVzIHRvIHN1cHBvcnQgdGhlIHJvbGUgbWFwcGluZyBmb3IgeW91ciBJQU0gdXNlcnMuXG4gICAqIFxuICAgKiBAcGFyYW0gcnVsZSBAdHlwZSBSb2xlTWFwcGluZ1xuICAgKiBcbiAgICogVE9ETyBDcmVhdGUgc29tZSB0ZXN0cyBmb3IgdGhpcyBjbGFzcyB0aGF0IGdlbmVyYXRlcyBleGFtcGxlIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICBhZGRNYXBwaW5nKHJ1bGU6IFJvbGVNYXBwaW5nKSB7XG4gICAgdGhpcy5ydWxlcy5wdXNoKHJ1bGUpO1xuICB9XG5cbiAgZ2V0UnVsZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucnVsZXM7XG4gIH1cbn0iXX0=