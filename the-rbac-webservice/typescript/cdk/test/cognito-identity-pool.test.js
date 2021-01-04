"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("@aws-cdk/assert");
const cdk = require("@aws-cdk/core");
const CognitoIdentityPoolStack = require("../lib/cognito-identity-pool-stack");
const stack_configuration_1 = require("../lib/configuration/stack-configuration");
require("@aws-cdk/assert/jest");
function initTestStack(stackName, props) {
    let app = new cdk.App();
    stack_configuration_1.StackConfiguration.cognitoDomain = "swa-hits";
    stack_configuration_1.StackConfiguration.identityProviders.providerName = "Auth0";
    const cognitoIdPoolSaml = new CognitoIdentityPoolStack.CognitoIdentityPoolStack(app, stackName, {
        userPoolClientConfig: stack_configuration_1.StackConfiguration.userPoolConfig,
        userPoolAttrSchema: stack_configuration_1.StackConfiguration.userPoolAttrSchema,
        identityProviders: {
            providerName: stack_configuration_1.StackConfiguration.identityProviders.providerName,
            samlProvider: stack_configuration_1.StackConfiguration.identityProviders.samlProvider
        },
        cognitoDomain: stack_configuration_1.StackConfiguration.cognitoDomain
    });
    return cognitoIdPoolSaml;
}
test('Verify that UserPool Resource has been Created', () => {
    // WHEN
    const stack = initTestStack('MyTestUPStack');
    // THEN
    assert_1.expect(stack).to(assert_1.haveResourceLike("AWS::Cognito::UserPool", {
        "Schema": [
            {
                "AttributeDataType": "String",
                "Mutable": true,
                "Name": "roles",
                "Required": false,
                "StringAttributeConstraints": {
                    "MaxLength": "2048",
                    "MinLength": "1"
                }
            }
        ]
    }));
});
test('Verify that UserPoolIdentityProvider Resource has been Created', () => {
    // WHEN
    const stack = initTestStack('MyTestUPIDPStack');
    // THEN
    expect(stack).toHaveResource("AWS::Cognito::UserPoolIdentityProvider", {
        "ProviderName": "Auth0",
        "ProviderType": "SAML",
        "UserPoolId": {
            "Ref": "MyTestUPIDPStackUserPoolE5D3352F"
        },
        "AttributeMapping": {
            "custom:roles": "http://schemas.auth0.com/roles",
            "Email": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        },
        "ProviderDetails": {
            "MetadataURL": "http://saml-metadataurl.com/example/url"
        }
    });
});
test('Verify that UserPoolClient has been Created', () => {
    // WHEN
    const stack = initTestStack('MyTestUPCStack');
    // THEN
    assert_1.expect(stack).to(assert_1.haveResourceLike("AWS::Cognito::UserPoolClient", {
        "UserPoolId": {
            "Ref": "MyTestUPCStackUserPoolFC506A7B"
        },
        "AllowedOAuthFlows": [
            "code"
        ],
        "AllowedOAuthFlowsUserPoolClient": true,
        "AllowedOAuthScopes": [
            "openid",
            "profile",
            "aws.cognito.signin.user.admin"
        ],
        "CallbackURLs": [
            "http://localhost:8080/callback"
        ],
        "ClientName": "MyTestUPCStackUserPoolClient",
        "LogoutURLs": [
            "http://localhost:8080/logout"
        ],
        "RefreshTokenValidity": 1,
        "SupportedIdentityProviders": [
            "Auth0"
        ],
        "WriteAttributes": [
            "custom:roles"
        ]
    }));
});
test('Verify that UserPoolClient has been Created', () => {
    // WHEN
    const stack = initTestStack('MyTestUPCStack');
    // THEN
    assert_1.expect(stack).to(assert_1.haveResourceLike("AWS::Cognito::IdentityPool", {
        "AllowUnauthenticatedIdentities": false
    }));
});
test('Verify that UserPoolDomain has been Created', () => {
    // WHEN
    const stack = initTestStack('Mycodomainstack');
    // THEN
    assert_1.expect(stack).to(assert_1.haveResourceLike("AWS::Cognito::UserPoolDomain", {
        "Domain": "swa-hits"
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29nbml0by1pZGVudGl0eS1wb29sLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb2duaXRvLWlkZW50aXR5LXBvb2wudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRDQUFtRztBQUNuRyxxQ0FBcUM7QUFDckMsK0VBQWdGO0FBQ2hGLGtGQUE4RTtBQUM5RSxnQ0FBOEI7QUFFOUIsU0FBUyxhQUFhLENBQUMsU0FBaUIsRUFBRSxLQUFVO0lBRWxELElBQUksR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBRXhCLHdDQUFrQixDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUM7SUFDOUMsd0NBQWtCLENBQUMsaUJBQWlCLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQztJQUU1RCxNQUFNLGlCQUFpQixHQUFHLElBQUksd0JBQXdCLENBQUMsd0JBQXdCLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRTtRQUM5RixvQkFBb0IsRUFBRSx3Q0FBa0IsQ0FBQyxjQUFjO1FBQ3ZELGtCQUFrQixFQUFFLHdDQUFrQixDQUFDLGtCQUFrQjtRQUN6RCxpQkFBaUIsRUFBRTtZQUNqQixZQUFZLEVBQUUsd0NBQWtCLENBQUMsaUJBQWlCLENBQUMsWUFBWTtZQUMvRCxZQUFZLEVBQUUsd0NBQWtCLENBQUMsaUJBQWlCLENBQUMsWUFBWTtTQUNoRTtRQUNELGFBQWEsRUFBRSx3Q0FBa0IsQ0FBQyxhQUFhO0tBQ2hELENBQUMsQ0FBQztJQUVILE9BQU8saUJBQWlCLENBQUM7QUFDM0IsQ0FBQztBQUVELElBQUksQ0FBQyxnREFBZ0QsRUFBRSxHQUFHLEVBQUU7SUFDMUQsT0FBTztJQUNQLE1BQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUM3QyxPQUFPO0lBQ1AsZUFBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyx5QkFBZ0IsQ0FBQyx3QkFBd0IsRUFBRTtRQUM3RCxRQUFRLEVBQUU7WUFDUjtnQkFDRSxtQkFBbUIsRUFBRSxRQUFRO2dCQUM3QixTQUFTLEVBQUUsSUFBSTtnQkFDZixNQUFNLEVBQUUsT0FBTztnQkFDZixVQUFVLEVBQUUsS0FBSztnQkFDakIsNEJBQTRCLEVBQUU7b0JBQzVCLFdBQVcsRUFBRSxNQUFNO29CQUNuQixXQUFXLEVBQUUsR0FBRztpQkFDakI7YUFDRjtTQUNGO0tBQ0YsQ0FDQSxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxnRUFBZ0UsRUFBRSxHQUFHLEVBQUU7SUFDMUUsT0FBTztJQUNQLE1BQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ2hELE9BQU87SUFDUCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsY0FBYyxDQUFDLHdDQUF3QyxFQUFFO1FBQ3JFLGNBQWMsRUFBRSxPQUFPO1FBQ3ZCLGNBQWMsRUFBRSxNQUFNO1FBQ3RCLFlBQVksRUFBRTtZQUNaLEtBQUssRUFBRSxrQ0FBa0M7U0FDMUM7UUFDRCxrQkFBa0IsRUFBRTtZQUNsQixjQUFjLEVBQUUsZ0NBQWdDO1lBQ2hELE9BQU8sRUFBRSxvRUFBb0U7U0FDOUU7UUFDRCxpQkFBaUIsRUFBRTtZQUNqQixhQUFhLEVBQUUseUNBQXlDO1NBQ3pEO0tBQ0YsQ0FDQSxDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFO0lBQ3ZELE9BQU87SUFDUCxNQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUM5QyxPQUFPO0lBQ1AsZUFBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyx5QkFBZ0IsQ0FBQyw4QkFBOEIsRUFBRTtRQUNuRSxZQUFZLEVBQUU7WUFDWixLQUFLLEVBQUUsZ0NBQWdDO1NBQ3hDO1FBQ0QsbUJBQW1CLEVBQUU7WUFDbkIsTUFBTTtTQUNQO1FBQ0QsaUNBQWlDLEVBQUUsSUFBSTtRQUN2QyxvQkFBb0IsRUFBRTtZQUNwQixRQUFRO1lBQ1IsU0FBUztZQUNULCtCQUErQjtTQUNoQztRQUNELGNBQWMsRUFBRTtZQUNkLGdDQUFnQztTQUNqQztRQUNELFlBQVksRUFBRSw4QkFBOEI7UUFDNUMsWUFBWSxFQUFFO1lBQ1osOEJBQThCO1NBQy9CO1FBQ0Qsc0JBQXNCLEVBQUUsQ0FBQztRQUN6Qiw0QkFBNEIsRUFBRTtZQUM1QixPQUFPO1NBQ1I7UUFDRCxpQkFBaUIsRUFBRTtZQUNqQixjQUFjO1NBQ2Y7S0FDRixDQUNBLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDZDQUE2QyxFQUFFLEdBQUcsRUFBRTtJQUN2RCxPQUFPO0lBQ1AsTUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDOUMsT0FBTztJQUNQLGVBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMseUJBQWdCLENBQUMsNEJBQTRCLEVBQUU7UUFDakUsZ0NBQWdDLEVBQUUsS0FBSztLQUN4QyxDQUNBLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDZDQUE2QyxFQUFFLEdBQUcsRUFBRTtJQUN2RCxPQUFPO0lBQ1AsTUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDL0MsT0FBTztJQUNQLGVBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMseUJBQWdCLENBQUMsOEJBQThCLEVBQUU7UUFDbkUsUUFBUSxFQUFFLFVBQVU7S0FDckIsQ0FDQSxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4cGVjdCBhcyBleHBlY3RDREssIG1hdGNoVGVtcGxhdGUsIGhhdmVSZXNvdXJjZUxpa2UsIE1hdGNoU3R5bGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnQnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IENvZ25pdG9JZGVudGl0eVBvb2xTdGFjayA9IHJlcXVpcmUoJy4uL2xpYi9jb2duaXRvLWlkZW50aXR5LXBvb2wtc3RhY2snKTtcbmltcG9ydCB7IFN0YWNrQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uL2xpYi9jb25maWd1cmF0aW9uL3N0YWNrLWNvbmZpZ3VyYXRpb24nO1xuaW1wb3J0ICdAYXdzLWNkay9hc3NlcnQvamVzdCc7XG5cbmZ1bmN0aW9uIGluaXRUZXN0U3RhY2soc3RhY2tOYW1lOiBzdHJpbmcsIHByb3BzPzoge30pIHtcblxuICBsZXQgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuICBTdGFja0NvbmZpZ3VyYXRpb24uY29nbml0b0RvbWFpbiA9IFwic3dhLWhpdHNcIjtcbiAgU3RhY2tDb25maWd1cmF0aW9uLmlkZW50aXR5UHJvdmlkZXJzLnByb3ZpZGVyTmFtZSA9IFwiQXV0aDBcIjtcblxuICBjb25zdCBjb2duaXRvSWRQb29sU2FtbCA9IG5ldyBDb2duaXRvSWRlbnRpdHlQb29sU3RhY2suQ29nbml0b0lkZW50aXR5UG9vbFN0YWNrKGFwcCwgc3RhY2tOYW1lLCB7XG4gICAgdXNlclBvb2xDbGllbnRDb25maWc6IFN0YWNrQ29uZmlndXJhdGlvbi51c2VyUG9vbENvbmZpZyxcbiAgICB1c2VyUG9vbEF0dHJTY2hlbWE6IFN0YWNrQ29uZmlndXJhdGlvbi51c2VyUG9vbEF0dHJTY2hlbWEsXG4gICAgaWRlbnRpdHlQcm92aWRlcnM6IHtcbiAgICAgIHByb3ZpZGVyTmFtZTogU3RhY2tDb25maWd1cmF0aW9uLmlkZW50aXR5UHJvdmlkZXJzLnByb3ZpZGVyTmFtZSxcbiAgICAgIHNhbWxQcm92aWRlcjogU3RhY2tDb25maWd1cmF0aW9uLmlkZW50aXR5UHJvdmlkZXJzLnNhbWxQcm92aWRlclxuICAgIH0sXG4gICAgY29nbml0b0RvbWFpbjogU3RhY2tDb25maWd1cmF0aW9uLmNvZ25pdG9Eb21haW5cbiAgfSk7XG5cbiAgcmV0dXJuIGNvZ25pdG9JZFBvb2xTYW1sO1xufVxuXG50ZXN0KCdWZXJpZnkgdGhhdCBVc2VyUG9vbCBSZXNvdXJjZSBoYXMgYmVlbiBDcmVhdGVkJywgKCkgPT4ge1xuICAvLyBXSEVOXG4gIGNvbnN0IHN0YWNrID0gaW5pdFRlc3RTdGFjaygnTXlUZXN0VVBTdGFjaycpO1xuICAvLyBUSEVOXG4gIGV4cGVjdENESyhzdGFjaykudG8oaGF2ZVJlc291cmNlTGlrZShcIkFXUzo6Q29nbml0bzo6VXNlclBvb2xcIiwge1xuICAgIFwiU2NoZW1hXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJBdHRyaWJ1dGVEYXRhVHlwZVwiOiBcIlN0cmluZ1wiLFxuICAgICAgICBcIk11dGFibGVcIjogdHJ1ZSxcbiAgICAgICAgXCJOYW1lXCI6IFwicm9sZXNcIixcbiAgICAgICAgXCJSZXF1aXJlZFwiOiBmYWxzZSxcbiAgICAgICAgXCJTdHJpbmdBdHRyaWJ1dGVDb25zdHJhaW50c1wiOiB7XG4gICAgICAgICAgXCJNYXhMZW5ndGhcIjogXCIyMDQ4XCIsXG4gICAgICAgICAgXCJNaW5MZW5ndGhcIjogXCIxXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIF1cbiAgfVxuICApKTtcbn0pO1xuXG50ZXN0KCdWZXJpZnkgdGhhdCBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXIgUmVzb3VyY2UgaGFzIGJlZW4gQ3JlYXRlZCcsICgpID0+IHtcbiAgLy8gV0hFTlxuICBjb25zdCBzdGFjayA9IGluaXRUZXN0U3RhY2soJ015VGVzdFVQSURQU3RhY2snKTtcbiAgLy8gVEhFTlxuICBleHBlY3Qoc3RhY2spLnRvSGF2ZVJlc291cmNlKFwiQVdTOjpDb2duaXRvOjpVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJcIiwge1xuICAgIFwiUHJvdmlkZXJOYW1lXCI6IFwiQXV0aDBcIixcbiAgICBcIlByb3ZpZGVyVHlwZVwiOiBcIlNBTUxcIixcbiAgICBcIlVzZXJQb29sSWRcIjoge1xuICAgICAgXCJSZWZcIjogXCJNeVRlc3RVUElEUFN0YWNrVXNlclBvb2xFNUQzMzUyRlwiXG4gICAgfSxcbiAgICBcIkF0dHJpYnV0ZU1hcHBpbmdcIjoge1xuICAgICAgXCJjdXN0b206cm9sZXNcIjogXCJodHRwOi8vc2NoZW1hcy5hdXRoMC5jb20vcm9sZXNcIixcbiAgICAgIFwiRW1haWxcIjogXCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3NcIlxuICAgIH0sXG4gICAgXCJQcm92aWRlckRldGFpbHNcIjoge1xuICAgICAgXCJNZXRhZGF0YVVSTFwiOiBcImh0dHA6Ly9zYW1sLW1ldGFkYXRhdXJsLmNvbS9leGFtcGxlL3VybFwiXG4gICAgfVxuICB9XG4gICk7XG59KTtcblxudGVzdCgnVmVyaWZ5IHRoYXQgVXNlclBvb2xDbGllbnQgaGFzIGJlZW4gQ3JlYXRlZCcsICgpID0+IHtcbiAgLy8gV0hFTlxuICBjb25zdCBzdGFjayA9IGluaXRUZXN0U3RhY2soJ015VGVzdFVQQ1N0YWNrJyk7XG4gIC8vIFRIRU5cbiAgZXhwZWN0Q0RLKHN0YWNrKS50byhoYXZlUmVzb3VyY2VMaWtlKFwiQVdTOjpDb2duaXRvOjpVc2VyUG9vbENsaWVudFwiLCB7XG4gICAgXCJVc2VyUG9vbElkXCI6IHtcbiAgICAgIFwiUmVmXCI6IFwiTXlUZXN0VVBDU3RhY2tVc2VyUG9vbEZDNTA2QTdCXCJcbiAgICB9LFxuICAgIFwiQWxsb3dlZE9BdXRoRmxvd3NcIjogW1xuICAgICAgXCJjb2RlXCJcbiAgICBdLFxuICAgIFwiQWxsb3dlZE9BdXRoRmxvd3NVc2VyUG9vbENsaWVudFwiOiB0cnVlLFxuICAgIFwiQWxsb3dlZE9BdXRoU2NvcGVzXCI6IFtcbiAgICAgIFwib3BlbmlkXCIsXG4gICAgICBcInByb2ZpbGVcIixcbiAgICAgIFwiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW5cIlxuICAgIF0sXG4gICAgXCJDYWxsYmFja1VSTHNcIjogW1xuICAgICAgXCJodHRwOi8vbG9jYWxob3N0OjgwODAvY2FsbGJhY2tcIlxuICAgIF0sXG4gICAgXCJDbGllbnROYW1lXCI6IFwiTXlUZXN0VVBDU3RhY2tVc2VyUG9vbENsaWVudFwiLFxuICAgIFwiTG9nb3V0VVJMc1wiOiBbXG4gICAgICBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9sb2dvdXRcIlxuICAgIF0sXG4gICAgXCJSZWZyZXNoVG9rZW5WYWxpZGl0eVwiOiAxLFxuICAgIFwiU3VwcG9ydGVkSWRlbnRpdHlQcm92aWRlcnNcIjogW1xuICAgICAgXCJBdXRoMFwiXG4gICAgXSxcbiAgICBcIldyaXRlQXR0cmlidXRlc1wiOiBbXG4gICAgICBcImN1c3RvbTpyb2xlc1wiXG4gICAgXVxuICB9XG4gICkpO1xufSk7XG5cbnRlc3QoJ1ZlcmlmeSB0aGF0IFVzZXJQb29sQ2xpZW50IGhhcyBiZWVuIENyZWF0ZWQnLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgY29uc3Qgc3RhY2sgPSBpbml0VGVzdFN0YWNrKCdNeVRlc3RVUENTdGFjaycpO1xuICAvLyBUSEVOXG4gIGV4cGVjdENESyhzdGFjaykudG8oaGF2ZVJlc291cmNlTGlrZShcIkFXUzo6Q29nbml0bzo6SWRlbnRpdHlQb29sXCIsIHtcbiAgICBcIkFsbG93VW5hdXRoZW50aWNhdGVkSWRlbnRpdGllc1wiOiBmYWxzZVxuICB9XG4gICkpO1xufSk7XG5cbnRlc3QoJ1ZlcmlmeSB0aGF0IFVzZXJQb29sRG9tYWluIGhhcyBiZWVuIENyZWF0ZWQnLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgY29uc3Qgc3RhY2sgPSBpbml0VGVzdFN0YWNrKCdNeWNvZG9tYWluc3RhY2snKTtcbiAgLy8gVEhFTlxuICBleHBlY3RDREsoc3RhY2spLnRvKGhhdmVSZXNvdXJjZUxpa2UoXCJBV1M6OkNvZ25pdG86OlVzZXJQb29sRG9tYWluXCIsIHtcbiAgICBcIkRvbWFpblwiOiBcInN3YS1oaXRzXCJcbiAgfVxuICApKTtcbn0pOyJdfQ==