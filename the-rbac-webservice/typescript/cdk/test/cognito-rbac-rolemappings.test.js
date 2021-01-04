"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("@aws-cdk/assert");
const cdk = require("@aws-cdk/core");
const LeastPrivilegeWebserviceStack = require("../lib/least-privilege-webservice-stack");
const CognitoIdentityPoolStack = require("../lib/cognito-identity-pool-stack");
const CognitoRbacRoleMappingStack = require("../lib/cognito-rbac-rolemappings-stack");
const stack_configuration_1 = require("../lib/configuration/stack-configuration");
test('Test for accurate Role Mappings', () => {
    const app = new cdk.App();
    stack_configuration_1.StackConfiguration.cognitoDomain = "swa-hits";
    stack_configuration_1.StackConfiguration.identityProviders.providerName = "Auth0";
    const webServiceStack = new LeastPrivilegeWebserviceStack.LeastPrivilegeWebserviceStack(app, 'swa-lp-webservice-stack');
    const identityPoolStack = new CognitoIdentityPoolStack.CognitoIdentityPoolStack(app, 'swa-lp-identity-pool-stack', {
        userPoolClientConfig: stack_configuration_1.StackConfiguration.userPoolConfig,
        userPoolAttrSchema: stack_configuration_1.StackConfiguration.userPoolAttrSchema,
        identityProviders: {
            providerName: stack_configuration_1.StackConfiguration.identityProviders.providerName,
            samlProvider: stack_configuration_1.StackConfiguration.identityProviders.samlProvider
        },
        cognitoDomain: stack_configuration_1.StackConfiguration.cognitoDomain
    });
    const stackUnderTest = new CognitoRbacRoleMappingStack.CognitoRbacRoleMappingStack(app, 'swa-lp-role-mappings', {
        cognitoIdentityPoolStack: identityPoolStack,
        webServiceStack: webServiceStack,
        mappingAttr: stack_configuration_1.StackConfiguration.userPoolAttrSchema[0].name,
        cognitoAttr: stack_configuration_1.StackConfiguration.cognitoDestAttr,
        providerName: stack_configuration_1.StackConfiguration.identityProviders.providerName
    });
    assert_1.expect(stackUnderTest).to(assert_1.haveResourceLike("AWS::Cognito::IdentityPoolRoleAttachment", {
        "RoleMappings": {
            "Auth0": {
                "AmbiguousRoleResolution": "Deny",
                "RulesConfiguration": {
                    "Rules": [
                        {
                            "Claim": "custom:roles",
                            "MatchType": "Contains",
                            "Value": "admin"
                        },
                        {
                            "Claim": "custom:roles",
                            "MatchType": "Contains",
                            "Value": "user"
                        }
                    ]
                },
                "Type": "Rules"
            }
        }
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29nbml0by1yYmFjLXJvbGVtYXBwaW5ncy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29nbml0by1yYmFjLXJvbGVtYXBwaW5ncy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNENBQW1HO0FBQ25HLHFDQUFxQztBQUNyQyx5RkFBMEY7QUFDMUYsK0VBQWdGO0FBQ2hGLHNGQUF1RjtBQUN2RixrRkFBOEU7QUFFOUUsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtJQUN6QyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUUxQix3Q0FBa0IsQ0FBQyxhQUFhLEdBQUcsVUFBVSxDQUFDO0lBQzlDLHdDQUFrQixDQUFDLGlCQUFpQixDQUFDLFlBQVksR0FBRyxPQUFPLENBQUM7SUFFNUQsTUFBTSxlQUFlLEdBQUcsSUFBSSw2QkFBNkIsQ0FBQyw2QkFBNkIsQ0FBQyxHQUFHLEVBQUUseUJBQXlCLENBQUMsQ0FBQTtJQUV2SCxNQUFNLGlCQUFpQixHQUFHLElBQUksd0JBQXdCLENBQUMsd0JBQXdCLENBQUMsR0FBRyxFQUFFLDRCQUE0QixFQUFFO1FBQy9HLG9CQUFvQixFQUFFLHdDQUFrQixDQUFDLGNBQWM7UUFDdkQsa0JBQWtCLEVBQUUsd0NBQWtCLENBQUMsa0JBQWtCO1FBQ3pELGlCQUFpQixFQUFFO1lBQ2YsWUFBWSxFQUFFLHdDQUFrQixDQUFDLGlCQUFpQixDQUFDLFlBQVk7WUFDL0QsWUFBWSxFQUFFLHdDQUFrQixDQUFDLGlCQUFpQixDQUFDLFlBQVk7U0FDbEU7UUFDRCxhQUFhLEVBQUUsd0NBQWtCLENBQUMsYUFBYTtLQUVsRCxDQUFDLENBQUM7SUFFSCxNQUFNLGNBQWMsR0FBRyxJQUFJLDJCQUEyQixDQUFDLDJCQUEyQixDQUFDLEdBQUcsRUFBRSxzQkFBc0IsRUFBRTtRQUM1Ryx3QkFBd0IsRUFBRSxpQkFBaUI7UUFDM0MsZUFBZSxFQUFFLGVBQWU7UUFDaEMsV0FBVyxFQUFFLHdDQUFrQixDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7UUFDMUQsV0FBVyxFQUFFLHdDQUFrQixDQUFDLGVBQWU7UUFDL0MsWUFBWSxFQUFFLHdDQUFrQixDQUFDLGlCQUFpQixDQUFDLFlBQVk7S0FDbEUsQ0FBQyxDQUFBO0lBRUYsZUFBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyx5QkFBZ0IsQ0FBQywwQ0FBMEMsRUFBRTtRQUN0RixjQUFjLEVBQUU7WUFDWixPQUFPLEVBQUU7Z0JBQ1AseUJBQXlCLEVBQUUsTUFBTTtnQkFDakMsb0JBQW9CLEVBQUU7b0JBQ3BCLE9BQU8sRUFBRTt3QkFDUDs0QkFDRSxPQUFPLEVBQUUsY0FBYzs0QkFDdkIsV0FBVyxFQUFFLFVBQVU7NEJBQ3ZCLE9BQU8sRUFBRSxPQUFPO3lCQUNqQjt3QkFDRDs0QkFDRSxPQUFPLEVBQUUsY0FBYzs0QkFDdkIsV0FBVyxFQUFFLFVBQVU7NEJBQ3ZCLE9BQU8sRUFBRSxNQUFNO3lCQUNoQjtxQkFDRjtpQkFDRjtnQkFDRCxNQUFNLEVBQUUsT0FBTzthQUNoQjtTQUNGO0tBQ0YsQ0FDSixDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4cGVjdCBhcyBleHBlY3RDREssIG1hdGNoVGVtcGxhdGUsIGhhdmVSZXNvdXJjZUxpa2UsIE1hdGNoU3R5bGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnQnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IExlYXN0UHJpdmlsZWdlV2Vic2VydmljZVN0YWNrID0gcmVxdWlyZSgnLi4vbGliL2xlYXN0LXByaXZpbGVnZS13ZWJzZXJ2aWNlLXN0YWNrJyk7XG5pbXBvcnQgQ29nbml0b0lkZW50aXR5UG9vbFN0YWNrID0gcmVxdWlyZSgnLi4vbGliL2NvZ25pdG8taWRlbnRpdHktcG9vbC1zdGFjaycpO1xuaW1wb3J0IENvZ25pdG9SYmFjUm9sZU1hcHBpbmdTdGFjayA9IHJlcXVpcmUoJy4uL2xpYi9jb2duaXRvLXJiYWMtcm9sZW1hcHBpbmdzLXN0YWNrJyk7XG5pbXBvcnQgeyBTdGFja0NvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi9saWIvY29uZmlndXJhdGlvbi9zdGFjay1jb25maWd1cmF0aW9uJztcblxudGVzdCgnVGVzdCBmb3IgYWNjdXJhdGUgUm9sZSBNYXBwaW5ncycsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG4gICAgU3RhY2tDb25maWd1cmF0aW9uLmNvZ25pdG9Eb21haW4gPSBcInN3YS1oaXRzXCI7XG4gICAgU3RhY2tDb25maWd1cmF0aW9uLmlkZW50aXR5UHJvdmlkZXJzLnByb3ZpZGVyTmFtZSA9IFwiQXV0aDBcIjtcblxuICAgIGNvbnN0IHdlYlNlcnZpY2VTdGFjayA9IG5ldyBMZWFzdFByaXZpbGVnZVdlYnNlcnZpY2VTdGFjay5MZWFzdFByaXZpbGVnZVdlYnNlcnZpY2VTdGFjayhhcHAsICdzd2EtbHAtd2Vic2VydmljZS1zdGFjaycpXG5cbiAgICBjb25zdCBpZGVudGl0eVBvb2xTdGFjayA9IG5ldyBDb2duaXRvSWRlbnRpdHlQb29sU3RhY2suQ29nbml0b0lkZW50aXR5UG9vbFN0YWNrKGFwcCwgJ3N3YS1scC1pZGVudGl0eS1wb29sLXN0YWNrJywge1xuICAgICAgICB1c2VyUG9vbENsaWVudENvbmZpZzogU3RhY2tDb25maWd1cmF0aW9uLnVzZXJQb29sQ29uZmlnLFxuICAgICAgICB1c2VyUG9vbEF0dHJTY2hlbWE6IFN0YWNrQ29uZmlndXJhdGlvbi51c2VyUG9vbEF0dHJTY2hlbWEsXG4gICAgICAgIGlkZW50aXR5UHJvdmlkZXJzOiB7XG4gICAgICAgICAgICBwcm92aWRlck5hbWU6IFN0YWNrQ29uZmlndXJhdGlvbi5pZGVudGl0eVByb3ZpZGVycy5wcm92aWRlck5hbWUsXG4gICAgICAgICAgICBzYW1sUHJvdmlkZXI6IFN0YWNrQ29uZmlndXJhdGlvbi5pZGVudGl0eVByb3ZpZGVycy5zYW1sUHJvdmlkZXJcbiAgICAgICAgfSxcbiAgICAgICAgY29nbml0b0RvbWFpbjogU3RhY2tDb25maWd1cmF0aW9uLmNvZ25pdG9Eb21haW5cblxuICAgIH0pO1xuXG4gICAgY29uc3Qgc3RhY2tVbmRlclRlc3QgPSBuZXcgQ29nbml0b1JiYWNSb2xlTWFwcGluZ1N0YWNrLkNvZ25pdG9SYmFjUm9sZU1hcHBpbmdTdGFjayhhcHAsICdzd2EtbHAtcm9sZS1tYXBwaW5ncycsIHtcbiAgICAgICAgY29nbml0b0lkZW50aXR5UG9vbFN0YWNrOiBpZGVudGl0eVBvb2xTdGFjayxcbiAgICAgICAgd2ViU2VydmljZVN0YWNrOiB3ZWJTZXJ2aWNlU3RhY2ssXG4gICAgICAgIG1hcHBpbmdBdHRyOiBTdGFja0NvbmZpZ3VyYXRpb24udXNlclBvb2xBdHRyU2NoZW1hWzBdLm5hbWUsXG4gICAgICAgIGNvZ25pdG9BdHRyOiBTdGFja0NvbmZpZ3VyYXRpb24uY29nbml0b0Rlc3RBdHRyLFxuICAgICAgICBwcm92aWRlck5hbWU6IFN0YWNrQ29uZmlndXJhdGlvbi5pZGVudGl0eVByb3ZpZGVycy5wcm92aWRlck5hbWVcbiAgICB9KVxuXG4gICAgZXhwZWN0Q0RLKHN0YWNrVW5kZXJUZXN0KS50byhoYXZlUmVzb3VyY2VMaWtlKFwiQVdTOjpDb2duaXRvOjpJZGVudGl0eVBvb2xSb2xlQXR0YWNobWVudFwiLCB7XG4gICAgICAgIFwiUm9sZU1hcHBpbmdzXCI6IHtcbiAgICAgICAgICAgIFwiQXV0aDBcIjoge1xuICAgICAgICAgICAgICBcIkFtYmlndW91c1JvbGVSZXNvbHV0aW9uXCI6IFwiRGVueVwiLFxuICAgICAgICAgICAgICBcIlJ1bGVzQ29uZmlndXJhdGlvblwiOiB7XG4gICAgICAgICAgICAgICAgXCJSdWxlc1wiOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiQ2xhaW1cIjogXCJjdXN0b206cm9sZXNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJNYXRjaFR5cGVcIjogXCJDb250YWluc1wiLFxuICAgICAgICAgICAgICAgICAgICBcIlZhbHVlXCI6IFwiYWRtaW5cIlxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJDbGFpbVwiOiBcImN1c3RvbTpyb2xlc1wiLFxuICAgICAgICAgICAgICAgICAgICBcIk1hdGNoVHlwZVwiOiBcIkNvbnRhaW5zXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiVmFsdWVcIjogXCJ1c2VyXCJcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwiVHlwZVwiOiBcIlJ1bGVzXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICApKTtcbn0pOyJdfQ==