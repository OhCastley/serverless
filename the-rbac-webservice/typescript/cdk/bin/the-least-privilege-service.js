#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = require("@aws-cdk/core");
const cognito_identity_pool_stack_1 = require("../lib/cognito-identity-pool-stack");
const least_privilege_webservice_stack_1 = require("../lib/least-privilege-webservice-stack");
const cognito_rbac_rolemappings_stack_1 = require("../lib/cognito-rbac-rolemappings-stack");
const stack_configuration_1 = require("../lib/configuration/stack-configuration");
const app = new cdk.App();
// ================================================================================
// Create the Identity Pool Stack
// 
// Creates an AWS Cognito Identity pool for identities federated from the external identity provider
// Creates an AWS Cognito User Pool Client for your front end application to integrate with using OIDC
// =================================================================================
const identityPoolStack = new cognito_identity_pool_stack_1.CognitoIdentityPoolStack(app, 'swa-lp-identity-pool-stack', {
    userPoolClientConfig: stack_configuration_1.StackConfiguration.userPoolConfig,
    userPoolAttrSchema: stack_configuration_1.StackConfiguration.userPoolAttrSchema,
    identityProviders: {
        providerName: stack_configuration_1.StackConfiguration.identityProviders.providerName,
        samlProvider: stack_configuration_1.StackConfiguration.identityProviders.samlProvider
    },
    cognitoDomain: stack_configuration_1.StackConfiguration.cognitoDomain
});
// ================================================================================
// Create a WebService implemented using ApiGateway and Lambda
// 
// Web API with a lambda writing into a gateway
// We will define the Roles for this in the RBAC Role Mappings later in the stack
// ================================================================================
const webServiceStack = new least_privilege_webservice_stack_1.LeastPrivilegeWebserviceStack(app, 'swa-lp-webservice-stack', {
    identityPoolRef: identityPoolStack.identityPool.ref
});
// ================================================================================
// Map our Roles
// 
// Sets up the Roles needed for using our service (Admin Role and User Role)
// Using User Claims from the federated identity we map the user to a defined IAM Role
// =================================================================================
new cognito_rbac_rolemappings_stack_1.CognitoRbacRoleMappingStack(app, 'swa-lp-role-mappings', {
    cognitoIdentityPoolStack: identityPoolStack,
    webServiceStack: webServiceStack,
    mappingAttr: stack_configuration_1.StackConfiguration.userPoolAttrSchema[0].name,
    cognitoAttr: stack_configuration_1.StackConfiguration.cognitoDestAttr,
    providerName: stack_configuration_1.StackConfiguration.identityProviders.providerName
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlLWxlYXN0LXByaXZpbGVnZS1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGhlLWxlYXN0LXByaXZpbGVnZS1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHVDQUFxQztBQUNyQyxxQ0FBcUM7QUFFckMsb0ZBQThFO0FBQzlFLDhGQUF3RjtBQUN4Riw0RkFBcUY7QUFFckYsa0ZBQThFO0FBRTlFLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLG1GQUFtRjtBQUNuRixpQ0FBaUM7QUFDakMsR0FBRztBQUNILG9HQUFvRztBQUNwRyxzR0FBc0c7QUFDdEcsb0ZBQW9GO0FBRXBGLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxzREFBd0IsQ0FBQyxHQUFHLEVBQUUsNEJBQTRCLEVBQUU7SUFDdEYsb0JBQW9CLEVBQUUsd0NBQWtCLENBQUMsY0FBYztJQUN2RCxrQkFBa0IsRUFBRSx3Q0FBa0IsQ0FBQyxrQkFBa0I7SUFDekQsaUJBQWlCLEVBQUU7UUFDakIsWUFBWSxFQUFFLHdDQUFrQixDQUFDLGlCQUFpQixDQUFDLFlBQVk7UUFDL0QsWUFBWSxFQUFFLHdDQUFrQixDQUFDLGlCQUFpQixDQUFDLFlBQVk7S0FDaEU7SUFDRCxhQUFhLEVBQUUsd0NBQWtCLENBQUMsYUFBYTtDQUNoRCxDQUFDLENBQUM7QUFFTCxtRkFBbUY7QUFDbkYsOERBQThEO0FBQzlELEdBQUc7QUFDSCwrQ0FBK0M7QUFDL0MsaUZBQWlGO0FBQ2pGLG1GQUFtRjtBQUNuRixNQUFNLGVBQWUsR0FBRyxJQUFJLGdFQUE2QixDQUFDLEdBQUcsRUFBRSx5QkFBeUIsRUFBRTtJQUN4RixlQUFlLEVBQUUsaUJBQWlCLENBQUMsWUFBWSxDQUFDLEdBQUc7Q0FDcEQsQ0FBQyxDQUFBO0FBRUYsbUZBQW1GO0FBQ25GLGdCQUFnQjtBQUNoQixHQUFHO0FBQ0gsNEVBQTRFO0FBQzVFLHNGQUFzRjtBQUN0RixvRkFBb0Y7QUFFcEYsSUFBSSw2REFBMkIsQ0FBQyxHQUFHLEVBQUUsc0JBQXNCLEVBQUU7SUFDekQsd0JBQXdCLEVBQUUsaUJBQWlCO0lBQzNDLGVBQWUsRUFBRSxlQUFlO0lBQ2hDLFdBQVcsRUFBRSx3Q0FBa0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO0lBQzFELFdBQVcsRUFBRSx3Q0FBa0IsQ0FBQyxlQUFlO0lBQy9DLFlBQVksRUFBRSx3Q0FBa0IsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZO0NBQ2xFLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCAnc291cmNlLW1hcC1zdXBwb3J0L3JlZ2lzdGVyJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcblxuaW1wb3J0IHsgQ29nbml0b0lkZW50aXR5UG9vbFN0YWNrIH0gZnJvbSAnLi4vbGliL2NvZ25pdG8taWRlbnRpdHktcG9vbC1zdGFjayc7XG5pbXBvcnQgeyBMZWFzdFByaXZpbGVnZVdlYnNlcnZpY2VTdGFjayB9IGZyb20gJy4uL2xpYi9sZWFzdC1wcml2aWxlZ2Utd2Vic2VydmljZS1zdGFjayc7XG5pbXBvcnQgeyBDb2duaXRvUmJhY1JvbGVNYXBwaW5nU3RhY2sgfSBmcm9tICcuLi9saWIvY29nbml0by1yYmFjLXJvbGVtYXBwaW5ncy1zdGFjayc7XG5cbmltcG9ydCB7IFN0YWNrQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uL2xpYi9jb25maWd1cmF0aW9uL3N0YWNrLWNvbmZpZ3VyYXRpb24nO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gQ3JlYXRlIHRoZSBJZGVudGl0eSBQb29sIFN0YWNrXG4vLyBcbi8vIENyZWF0ZXMgYW4gQVdTIENvZ25pdG8gSWRlbnRpdHkgcG9vbCBmb3IgaWRlbnRpdGllcyBmZWRlcmF0ZWQgZnJvbSB0aGUgZXh0ZXJuYWwgaWRlbnRpdHkgcHJvdmlkZXJcbi8vIENyZWF0ZXMgYW4gQVdTIENvZ25pdG8gVXNlciBQb29sIENsaWVudCBmb3IgeW91ciBmcm9udCBlbmQgYXBwbGljYXRpb24gdG8gaW50ZWdyYXRlIHdpdGggdXNpbmcgT0lEQ1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGlkZW50aXR5UG9vbFN0YWNrID0gbmV3IENvZ25pdG9JZGVudGl0eVBvb2xTdGFjayhhcHAsICdzd2EtbHAtaWRlbnRpdHktcG9vbC1zdGFjaycsIHtcbiAgICB1c2VyUG9vbENsaWVudENvbmZpZzogU3RhY2tDb25maWd1cmF0aW9uLnVzZXJQb29sQ29uZmlnLFxuICAgIHVzZXJQb29sQXR0clNjaGVtYTogU3RhY2tDb25maWd1cmF0aW9uLnVzZXJQb29sQXR0clNjaGVtYSxcbiAgICBpZGVudGl0eVByb3ZpZGVyczoge1xuICAgICAgcHJvdmlkZXJOYW1lOiBTdGFja0NvbmZpZ3VyYXRpb24uaWRlbnRpdHlQcm92aWRlcnMucHJvdmlkZXJOYW1lLFxuICAgICAgc2FtbFByb3ZpZGVyOiBTdGFja0NvbmZpZ3VyYXRpb24uaWRlbnRpdHlQcm92aWRlcnMuc2FtbFByb3ZpZGVyXG4gICAgfSxcbiAgICBjb2duaXRvRG9tYWluOiBTdGFja0NvbmZpZ3VyYXRpb24uY29nbml0b0RvbWFpblxuICB9KTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIENyZWF0ZSBhIFdlYlNlcnZpY2UgaW1wbGVtZW50ZWQgdXNpbmcgQXBpR2F0ZXdheSBhbmQgTGFtYmRhXG4vLyBcbi8vIFdlYiBBUEkgd2l0aCBhIGxhbWJkYSB3cml0aW5nIGludG8gYSBnYXRld2F5XG4vLyBXZSB3aWxsIGRlZmluZSB0aGUgUm9sZXMgZm9yIHRoaXMgaW4gdGhlIFJCQUMgUm9sZSBNYXBwaW5ncyBsYXRlciBpbiB0aGUgc3RhY2tcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jb25zdCB3ZWJTZXJ2aWNlU3RhY2sgPSBuZXcgTGVhc3RQcml2aWxlZ2VXZWJzZXJ2aWNlU3RhY2soYXBwLCAnc3dhLWxwLXdlYnNlcnZpY2Utc3RhY2snLCB7XG4gIGlkZW50aXR5UG9vbFJlZjogaWRlbnRpdHlQb29sU3RhY2suaWRlbnRpdHlQb29sLnJlZlxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1hcCBvdXIgUm9sZXNcbi8vIFxuLy8gU2V0cyB1cCB0aGUgUm9sZXMgbmVlZGVkIGZvciB1c2luZyBvdXIgc2VydmljZSAoQWRtaW4gUm9sZSBhbmQgVXNlciBSb2xlKVxuLy8gVXNpbmcgVXNlciBDbGFpbXMgZnJvbSB0aGUgZmVkZXJhdGVkIGlkZW50aXR5IHdlIG1hcCB0aGUgdXNlciB0byBhIGRlZmluZWQgSUFNIFJvbGVcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5uZXcgQ29nbml0b1JiYWNSb2xlTWFwcGluZ1N0YWNrKGFwcCwgJ3N3YS1scC1yb2xlLW1hcHBpbmdzJywge1xuICAgIGNvZ25pdG9JZGVudGl0eVBvb2xTdGFjazogaWRlbnRpdHlQb29sU3RhY2ssXG4gICAgd2ViU2VydmljZVN0YWNrOiB3ZWJTZXJ2aWNlU3RhY2ssXG4gICAgbWFwcGluZ0F0dHI6IFN0YWNrQ29uZmlndXJhdGlvbi51c2VyUG9vbEF0dHJTY2hlbWFbMF0ubmFtZSxcbiAgICBjb2duaXRvQXR0cjogU3RhY2tDb25maWd1cmF0aW9uLmNvZ25pdG9EZXN0QXR0cixcbiAgICBwcm92aWRlck5hbWU6IFN0YWNrQ29uZmlndXJhdGlvbi5pZGVudGl0eVByb3ZpZGVycy5wcm92aWRlck5hbWVcbn0pXG4iXX0=