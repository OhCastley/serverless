"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const cognito = require("@aws-cdk/aws-cognito");
class CognitoIdentityPoolStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // ========================================================================
        // Resource: Amazon Cognito User Pool
        // ========================================================================
        // See also:
        // - https://aws.amazon.com/cognito/
        // - https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-cognito.CfnIdentityPool.html
        this.userPool = new cognito.UserPool(this, id + "UserPool", {});
        // any properties that are not part of the high level construct can be added using this method
        const userPoolCfn = this.userPool.node.defaultChild;
        userPoolCfn.userPoolAddOns = { advancedSecurityMode: "ENFORCED" };
        userPoolCfn.schema = props.userPoolAttrSchema;
        // ========================================================================
        // Resource: Identity Provider Settings
        // ========================================================================
        // Purpose: define the external Identity Provider details, field mappings etc.
        // See also:
        // - https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-saml-idp.html
        const supportedIdentityProviders = [];
        let cognitoManagedIdp = undefined;
        if (props.identityProviders.samlProvider) {
            cognitoManagedIdp = new cognito.CfnUserPoolIdentityProvider(this, "CognitoIdP", {
                providerName: props.identityProviders.providerName,
                providerType: props.identityProviders.samlProvider.type,
                providerDetails: {
                    MetadataURL: props.identityProviders.samlProvider.details.MetaDataURL
                },
                // Structure: { "<cognito attribute name>": "<IdP SAML attribute name>" }
                attributeMapping: props.identityProviders.samlProvider.attributeMapping,
                userPoolId: this.userPool.userPoolId
            });
        } // TODO Extend this for OIDC
        supportedIdentityProviders.push(props.identityProviders.providerName);
        // ========================================================================
        // Resource: Amazon Cognito User Pool Client
        // ========================================================================
        // A User Pool Client resource represents an Amazon Cognito User Pool Client that provides a way to 
        // generate authentication tokens used to authorize a user for an application. Configuring a User Pool Client 
        // then connecting it to a User Pool will generate to a User Pool client ID. An application will need this 
        // client ID in order for it to access the User Pool, in addition to the necessary User Pool's identifiers.
        // See also:
        // - https://aws.amazon.com/cognito/
        // - https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html
        this.userPoolClient = new cognito.CfnUserPoolClient(this, id + 'UserPoolClient', {
            supportedIdentityProviders: supportedIdentityProviders,
            allowedOAuthFlowsUserPoolClient: props.userPoolClientConfig.allowedOAuthFlowsUserPoolClient,
            allowedOAuthFlows: props.userPoolClientConfig.allowedOAuthFlows,
            allowedOAuthScopes: props.userPoolClientConfig.allowedOAuthScopes,
            refreshTokenValidity: props.userPoolClientConfig.refreshTokenValidity,
            writeAttributes: props.userPoolClientConfig.writeAttributes,
            callbackUrLs: props.userPoolClientConfig.callbackUrLs,
            logoutUrLs: props.userPoolClientConfig.logoutUrLs,
            clientName: id + 'UserPoolClient',
            userPoolId: this.userPool.userPoolId
        });
        // we want to make sure we do things in the right order
        if (cognitoManagedIdp) {
            this.userPoolClient.node.addDependency(cognitoManagedIdp);
        }
        // ========================================================================
        // Resource: CognitoUserPoolDomain
        // ========================================================================
        // Purpose: creates / updates the custom subdomain for cognito's hosted UI
        // See also:
        // https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-assign-domain.html
        const cfnUserPoolDomain = new cognito.CfnUserPoolDomain(this, "CognitoDomain", {
            domain: props.cognitoDomain,
            userPoolId: this.userPool.userPoolId
        });
        // ========================================================================
        // Resource: Amazon Cognito Identity Pool
        // ========================================================================
        //
        // Purpose: Create an pool that stores our 3p identities
        //
        // See also:
        // - https://aws.amazon.com/cognito/
        // - https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-cognito.CfnIdentityPool.html
        this.identityPool = new cognito.CfnIdentityPool(this, id + 'IdentityPool', {
            allowUnauthenticatedIdentities: false,
            cognitoIdentityProviders: [{
                    clientId: this.userPoolClient.ref,
                    providerName: this.userPool.userPoolProviderName,
                }]
        });
        //Outputs
        new cdk.CfnOutput(this, "UserPoolIdOutput", {
            description: "UserPool ID",
            value: this.userPool.userPoolId
        });
        new cdk.CfnOutput(this, "WebClientIdOutput", {
            description: "App Client ID",
            value: this.userPoolClient.ref
        });
        new cdk.CfnOutput(this, "IdentityPoolId", {
            description: "Identity Pool ID",
            value: this.identityPool.ref
        });
        new cdk.CfnOutput(this, "CognitoDomainOutput", {
            description: "Cognito Domain",
            value: cfnUserPoolDomain.domain
        });
        new cdk.CfnOutput(this, "RegionOutput", {
            description: "Region",
            value: this.region
        });
    }
}
exports.CognitoIdentityPoolStack = CognitoIdentityPoolStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29nbml0by1pZGVudGl0eS1wb29sLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29nbml0by1pZGVudGl0eS1wb29sLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQXFDO0FBQ3JDLGdEQUFpRDtBQW1CakQsTUFBYSx3QkFBeUIsU0FBUSxHQUFHLENBQUMsS0FBSztJQU1yRCxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQStCO1FBQzNFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLDJFQUEyRTtRQUMzRSxxQ0FBcUM7UUFDckMsMkVBQTJFO1FBRTNFLFlBQVk7UUFDWixvQ0FBb0M7UUFDcEMsOEZBQThGO1FBRTlGLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWhFLDhGQUE4RjtRQUM5RixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUEyQixDQUFDO1FBQ25FLFdBQVcsQ0FBQyxjQUFjLEdBQUcsRUFBRSxvQkFBb0IsRUFBRSxVQUFVLEVBQUUsQ0FBQTtRQUNqRSxXQUFXLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQztRQUU5QywyRUFBMkU7UUFDM0UsdUNBQXVDO1FBQ3ZDLDJFQUEyRTtRQUMzRSw4RUFBOEU7UUFDOUUsWUFBWTtRQUNaLCtGQUErRjtRQUUvRixNQUFNLDBCQUEwQixHQUFHLEVBQUUsQ0FBQztRQUN0QyxJQUFJLGlCQUFpQixHQUE0QyxTQUFTLENBQUM7UUFFM0UsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFO1lBQ3hDLGlCQUFpQixHQUFHLElBQUksT0FBTyxDQUFDLDJCQUEyQixDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7Z0JBQzlF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WUFDMUIsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVTtTQUNoQyxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFO1lBQzNDLFdBQVcsRUFBRSxlQUFlO1lBQzVCLEtBQUssRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUc7U0FDL0IsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUN4QyxXQUFXLEVBQUUsa0JBQWtCO1lBQy9CLEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUc7U0FDN0IsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRTtZQUM3QyxXQUFXLEVBQUUsZ0JBQWdCO1lBQzdCLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxNQUFNO1NBQ2hDLENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3RDLFdBQVcsRUFBRSxRQUFRO1lBQ3JCLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTTtTQUNuQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUExSUQsNERBMElDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IGNvZ25pdG8gPSByZXF1aXJlKFwiQGF3cy1jZGsvYXdzLWNvZ25pdG9cIik7XG5pbXBvcnQgeyBDZm5Vc2VyUG9vbCwgQ2ZuVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyLCBDZm5JZGVudGl0eVBvb2xSb2xlQXR0YWNobWVudCwgVXNlclBvb2wgfSBmcm9tIFwiQGF3cy1jZGsvYXdzLWNvZ25pdG9cIjtcblxuaW1wb3J0IHsgaVNBTUxQcm92aWRlckNvbmZpZyB9IGZyb20gXCIuL2ludGVyZmFjZXMvSVNBTUxQcm92aWRlckNvbmZpZ1wiO1xuaW1wb3J0IHsgaU9JRENQcm92aWRlckNvbmZpZyB9IGZyb20gXCIuL2ludGVyZmFjZXMvaU9JRENQcm92aWRlckNvbmZpZ1wiO1xuaW1wb3J0IHsgaUF0dHJTY2hlbWEgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL2lBdHRyU2NoZW1hXCI7XG5pbXBvcnQgeyBpVXNlclBvb2xDb25maWcgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL2lVc2VyUG9vbENvbmZpZ1wiO1xuXG5pbnRlcmZhY2UgQ29nbml0b0lkZW50aXR5UG9vbFByb3BzIGV4dGVuZHMgY2RrLlN0YWNrUHJvcHMge1xuICB1c2VyUG9vbENsaWVudENvbmZpZzogaVVzZXJQb29sQ29uZmlnO1xuICB1c2VyUG9vbEF0dHJTY2hlbWE6IEFycmF5PGlBdHRyU2NoZW1hPjtcbiAgaWRlbnRpdHlQcm92aWRlcnM6IHtcbiAgICBwcm92aWRlck5hbWU6IHN0cmluZztcbiAgICBvaWRjUHJvdmlkZXI/OiBpT0lEQ1Byb3ZpZGVyQ29uZmlnO1xuICAgIHNhbWxQcm92aWRlcj86IGlTQU1MUHJvdmlkZXJDb25maWc7XG4gIH1cbiAgY29nbml0b0RvbWFpbjogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgQ29nbml0b0lkZW50aXR5UG9vbFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgXG4gIHB1YmxpYyB1c2VyUG9vbDogY29nbml0by5Vc2VyUG9vbDtcbiAgcHVibGljIHVzZXJQb29sQ2xpZW50OiBjb2duaXRvLkNmblVzZXJQb29sQ2xpZW50O1xuICBwdWJsaWMgaWRlbnRpdHlQb29sOiBjb2duaXRvLkNmbklkZW50aXR5UG9vbDtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENvZ25pdG9JZGVudGl0eVBvb2xQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gUmVzb3VyY2U6IEFtYXpvbiBDb2duaXRvIFVzZXIgUG9vbFxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgLy8gU2VlIGFsc286XG4gICAgLy8gLSBodHRwczovL2F3cy5hbWF6b24uY29tL2NvZ25pdG8vXG4gICAgLy8gLSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2FwaS9sYXRlc3QvZG9jcy9AYXdzLWNka19hd3MtY29nbml0by5DZm5JZGVudGl0eVBvb2wuaHRtbFxuXG4gICAgdGhpcy51c2VyUG9vbCA9IG5ldyBjb2duaXRvLlVzZXJQb29sKHRoaXMsIGlkICsgXCJVc2VyUG9vbFwiLCB7fSk7XG5cbiAgICAvLyBhbnkgcHJvcGVydGllcyB0aGF0IGFyZSBub3QgcGFydCBvZiB0aGUgaGlnaCBsZXZlbCBjb25zdHJ1Y3QgY2FuIGJlIGFkZGVkIHVzaW5nIHRoaXMgbWV0aG9kXG4gICAgY29uc3QgdXNlclBvb2xDZm4gPSB0aGlzLnVzZXJQb29sLm5vZGUuZGVmYXVsdENoaWxkIGFzIENmblVzZXJQb29sO1xuICAgIHVzZXJQb29sQ2ZuLnVzZXJQb29sQWRkT25zID0geyBhZHZhbmNlZFNlY3VyaXR5TW9kZTogXCJFTkZPUkNFRFwiIH1cbiAgICB1c2VyUG9vbENmbi5zY2hlbWEgPSBwcm9wcy51c2VyUG9vbEF0dHJTY2hlbWE7XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBSZXNvdXJjZTogSWRlbnRpdHkgUHJvdmlkZXIgU2V0dGluZ3NcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBQdXJwb3NlOiBkZWZpbmUgdGhlIGV4dGVybmFsIElkZW50aXR5IFByb3ZpZGVyIGRldGFpbHMsIGZpZWxkIG1hcHBpbmdzIGV0Yy5cbiAgICAvLyBTZWUgYWxzbzpcbiAgICAvLyAtIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2duaXRvL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9jb2duaXRvLXVzZXItcG9vbHMtc2FtbC1pZHAuaHRtbFxuXG4gICAgY29uc3Qgc3VwcG9ydGVkSWRlbnRpdHlQcm92aWRlcnMgPSBbXTtcbiAgICBsZXQgY29nbml0b01hbmFnZWRJZHA6IENmblVzZXJQb29sSWRlbnRpdHlQcm92aWRlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICAgIGlmIChwcm9wcy5pZGVudGl0eVByb3ZpZGVycy5zYW1sUHJvdmlkZXIpIHtcbiAgICAgIGNvZ25pdG9NYW5hZ2VkSWRwID0gbmV3IGNvZ25pdG8uQ2ZuVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyKHRoaXMsIFwiQ29nbml0b0lkUFwiLCB7XG4gICAgICAgIHByb3ZpZGVyTmFtZTogcHJvcHMuaWRlbnRpdHlQcm92aWRlcnMucHJvdmlkZXJOYW1lLFxuICAgICAgICBwcm92aWRlclR5cGU6IHByb3BzLmlkZW50aXR5UHJvdmlkZXJzLnNhbWxQcm92aWRlci50eXBlLFxuICAgICAgICBwcm92aWRlckRldGFpbHM6IHtcbiAgICAgICAgICBNZXRhZGF0YVVSTDogcHJvcHMuaWRlbnRpdHlQcm92aWRlcnMuc2FtbFByb3ZpZGVyLmRldGFpbHMuTWV0YURhdGFVUkxcbiAgICAgICAgfSxcbiAgICAgICAgLy8gU3RydWN0dXJlOiB7IFwiPGNvZ25pdG8gYXR0cmlidXRlIG5hbWU+XCI6IFwiPElkUCBTQU1MIGF0dHJpYnV0ZSBuYW1lPlwiIH1cbiAgICAgICAgYXR0cmlidXRlTWFwcGluZzogcHJvcHMuaWRlbnRpdHlQcm92aWRlcnMuc2FtbFByb3ZpZGVyLmF0dHJpYnV0ZU1hcHBpbmcsXG4gICAgICAgIHVzZXJQb29sSWQ6IHRoaXMudXNlclBvb2wudXNlclBvb2xJZFxuICAgICAgfSk7XG4gICAgfSAvLyBUT0RPIEV4dGVuZCB0aGlzIGZvciBPSURDXG4gICAgc3VwcG9ydGVkSWRlbnRpdHlQcm92aWRlcnMucHVzaChwcm9wcy5pZGVudGl0eVByb3ZpZGVycy5wcm92aWRlck5hbWUpO1xuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBSZXNvdXJjZTogQW1hem9uIENvZ25pdG8gVXNlciBQb29sIENsaWVudFxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgLy8gQSBVc2VyIFBvb2wgQ2xpZW50IHJlc291cmNlIHJlcHJlc2VudHMgYW4gQW1hem9uIENvZ25pdG8gVXNlciBQb29sIENsaWVudCB0aGF0IHByb3ZpZGVzIGEgd2F5IHRvIFxuICAgIC8vIGdlbmVyYXRlIGF1dGhlbnRpY2F0aW9uIHRva2VucyB1c2VkIHRvIGF1dGhvcml6ZSBhIHVzZXIgZm9yIGFuIGFwcGxpY2F0aW9uLiBDb25maWd1cmluZyBhIFVzZXIgUG9vbCBDbGllbnQgXG4gICAgLy8gdGhlbiBjb25uZWN0aW5nIGl0IHRvIGEgVXNlciBQb29sIHdpbGwgZ2VuZXJhdGUgdG8gYSBVc2VyIFBvb2wgY2xpZW50IElELiBBbiBhcHBsaWNhdGlvbiB3aWxsIG5lZWQgdGhpcyBcbiAgICAvLyBjbGllbnQgSUQgaW4gb3JkZXIgZm9yIGl0IHRvIGFjY2VzcyB0aGUgVXNlciBQb29sLCBpbiBhZGRpdGlvbiB0byB0aGUgbmVjZXNzYXJ5IFVzZXIgUG9vbCdzIGlkZW50aWZpZXJzLlxuXG4gICAgLy8gU2VlIGFsc286XG4gICAgLy8gLSBodHRwczovL2F3cy5hbWF6b24uY29tL2NvZ25pdG8vXG4gICAgLy8gLSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtY29nbml0by11c2VycG9vbGNsaWVudC5odG1sXG5cbiAgICB0aGlzLnVzZXJQb29sQ2xpZW50ID0gbmV3IGNvZ25pdG8uQ2ZuVXNlclBvb2xDbGllbnQodGhpcywgaWQgKyAnVXNlclBvb2xDbGllbnQnLCB7XG4gICAgICBzdXBwb3J0ZWRJZGVudGl0eVByb3ZpZGVyczogc3VwcG9ydGVkSWRlbnRpdHlQcm92aWRlcnMsXG4gICAgICBhbGxvd2VkT0F1dGhGbG93c1VzZXJQb29sQ2xpZW50OiBwcm9wcy51c2VyUG9vbENsaWVudENvbmZpZy5hbGxvd2VkT0F1dGhGbG93c1VzZXJQb29sQ2xpZW50LFxuICAgICAgYWxsb3dlZE9BdXRoRmxvd3M6IHByb3BzLnVzZXJQb29sQ2xpZW50Q29uZmlnLmFsbG93ZWRPQXV0aEZsb3dzLFxuICAgICAgYWxsb3dlZE9BdXRoU2NvcGVzOiBwcm9wcy51c2VyUG9vbENsaWVudENvbmZpZy5hbGxvd2VkT0F1dGhTY29wZXMsXG4gICAgICByZWZyZXNoVG9rZW5WYWxpZGl0eTogcHJvcHMudXNlclBvb2xDbGllbnRDb25maWcucmVmcmVzaFRva2VuVmFsaWRpdHksXG4gICAgICB3cml0ZUF0dHJpYnV0ZXM6IHByb3BzLnVzZXJQb29sQ2xpZW50Q29uZmlnLndyaXRlQXR0cmlidXRlcyxcbiAgICAgIGNhbGxiYWNrVXJMczogcHJvcHMudXNlclBvb2xDbGllbnRDb25maWcuY2FsbGJhY2tVckxzLFxuICAgICAgbG9nb3V0VXJMczogcHJvcHMudXNlclBvb2xDbGllbnRDb25maWcubG9nb3V0VXJMcyxcbiAgICAgIGNsaWVudE5hbWU6IGlkICsgJ1VzZXJQb29sQ2xpZW50JyxcbiAgICAgIHVzZXJQb29sSWQ6IHRoaXMudXNlclBvb2wudXNlclBvb2xJZFxuICAgIH0pXG5cbiAgICAvLyB3ZSB3YW50IHRvIG1ha2Ugc3VyZSB3ZSBkbyB0aGluZ3MgaW4gdGhlIHJpZ2h0IG9yZGVyXG4gICAgaWYgKGNvZ25pdG9NYW5hZ2VkSWRwKSB7XG4gICAgICB0aGlzLnVzZXJQb29sQ2xpZW50Lm5vZGUuYWRkRGVwZW5kZW5jeShjb2duaXRvTWFuYWdlZElkcCk7XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gUmVzb3VyY2U6IENvZ25pdG9Vc2VyUG9vbERvbWFpblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgLy8gUHVycG9zZTogY3JlYXRlcyAvIHVwZGF0ZXMgdGhlIGN1c3RvbSBzdWJkb21haW4gZm9yIGNvZ25pdG8ncyBob3N0ZWQgVUlcblxuICAgIC8vIFNlZSBhbHNvOlxuICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2duaXRvL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9jb2duaXRvLXVzZXItcG9vbHMtYXNzaWduLWRvbWFpbi5odG1sXG5cbiAgICBjb25zdCBjZm5Vc2VyUG9vbERvbWFpbiA9IG5ldyBjb2duaXRvLkNmblVzZXJQb29sRG9tYWluKHRoaXMsIFwiQ29nbml0b0RvbWFpblwiLCB7XG4gICAgICBkb21haW46IHByb3BzLmNvZ25pdG9Eb21haW4sXG4gICAgICB1c2VyUG9vbElkOiB0aGlzLnVzZXJQb29sLnVzZXJQb29sSWRcbiAgICB9KTtcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIFJlc291cmNlOiBBbWF6b24gQ29nbml0byBJZGVudGl0eSBQb29sXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy9cbiAgICAvLyBQdXJwb3NlOiBDcmVhdGUgYW4gcG9vbCB0aGF0IHN0b3JlcyBvdXIgM3AgaWRlbnRpdGllc1xuICAgIC8vXG4gICAgLy8gU2VlIGFsc286XG4gICAgLy8gLSBodHRwczovL2F3cy5hbWF6b24uY29tL2NvZ25pdG8vXG4gICAgLy8gLSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2FwaS9sYXRlc3QvZG9jcy9AYXdzLWNka19hd3MtY29nbml0by5DZm5JZGVudGl0eVBvb2wuaHRtbFxuXG4gICAgdGhpcy5pZGVudGl0eVBvb2wgPSBuZXcgY29nbml0by5DZm5JZGVudGl0eVBvb2wodGhpcywgaWQgKyAnSWRlbnRpdHlQb29sJywge1xuICAgICAgYWxsb3dVbmF1dGhlbnRpY2F0ZWRJZGVudGl0aWVzOiBmYWxzZSxcbiAgICAgIGNvZ25pdG9JZGVudGl0eVByb3ZpZGVyczogW3tcbiAgICAgICAgY2xpZW50SWQ6IHRoaXMudXNlclBvb2xDbGllbnQucmVmLFxuICAgICAgICBwcm92aWRlck5hbWU6IHRoaXMudXNlclBvb2wudXNlclBvb2xQcm92aWRlck5hbWUsXG4gICAgICB9XVxuICAgIH0pO1xuXG4gICAgLy9PdXRwdXRzXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgXCJVc2VyUG9vbElkT3V0cHV0XCIsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlVzZXJQb29sIElEXCIsXG4gICAgICB2YWx1ZTogdGhpcy51c2VyUG9vbC51c2VyUG9vbElkXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBcIldlYkNsaWVudElkT3V0cHV0XCIsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkFwcCBDbGllbnQgSURcIixcbiAgICAgIHZhbHVlOiB0aGlzLnVzZXJQb29sQ2xpZW50LnJlZlxuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgXCJJZGVudGl0eVBvb2xJZFwiLCB7XG4gICAgICBkZXNjcmlwdGlvbjogXCJJZGVudGl0eSBQb29sIElEXCIsXG4gICAgICB2YWx1ZTogdGhpcy5pZGVudGl0eVBvb2wucmVmXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBcIkNvZ25pdG9Eb21haW5PdXRwdXRcIiwge1xuICAgICAgZGVzY3JpcHRpb246IFwiQ29nbml0byBEb21haW5cIixcbiAgICAgIHZhbHVlOiBjZm5Vc2VyUG9vbERvbWFpbi5kb21haW5cbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsIFwiUmVnaW9uT3V0cHV0XCIsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlJlZ2lvblwiLFxuICAgICAgdmFsdWU6IHRoaXMucmVnaW9uXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==