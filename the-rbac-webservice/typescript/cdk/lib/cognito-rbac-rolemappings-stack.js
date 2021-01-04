"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const iam = require("@aws-cdk/aws-iam");
const aws_cognito_1 = require("@aws-cdk/aws-cognito");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const eMatchTypes_1 = require("./enums/eMatchTypes");
// Helper Classes
const role_mapper_1 = require("../util/role-mapper");
class CognitoRbacRoleMappingStack extends cdk.Stack {
    /**
     *  CognitoRbacRoleMappingStack (cdk.stack)
     *
     *  This stack will create the roles for accessing our Web API Gateway Methods
     *
     *  We will create two roles
     *    - Admin Role (Can put records into DynamoDB, Can call update & read endpoint)
     *    - Read Role (Can read a record from a DynamoDB, Can call read endpoint)
     *
     *  We will allow both roles to be assumed-by the Cognito Identity Pool
     *
     *  We will then setup the AWS-Cognito-Identity-Pool RoleMapping Attachments
     *    - Post Authentication this is how the Identity Pool will assign the role to the authenticated User
     *
     */
    constructor(scope, id, props) {
        super(scope, id, props);
        // ============================================================================================
        //    Resource: AWS::IAM::Role 
        //        The Deafult IAM Roles for the Identity Pool
        //        TODO Should be getting rid of these based on the refactorting of this stack.
        // ============================================================================================
        const unauthenticatedDefaultRole = new iam.Role(this, 'CognitoDefaultUnauthenticatedRole', {
            assumedBy: new iam.FederatedPrincipal('cognito-identity.amazonaws.com', {
                "StringEquals": { "cognito-identity.amazonaws.com:aud": props.cognitoIdentityPoolStack.identityPool.ref },
                "ForAnyValue:StringLike": { "cognito-identity.amazonaws.com:amr": "unauthenticated" },
            }, "sts:AssumeRoleWithWebIdentity"),
        });
        unauthenticatedDefaultRole.addToPolicy(new aws_iam_1.PolicyStatement({
            effect: aws_iam_1.Effect.ALLOW,
            actions: [
                "mobileanalytics:PutEvents",
                "cognito-sync:*"
            ],
            resources: ["*"],
        }));
        const authenticatedDefaultRole = new iam.Role(this, 'CognitoDefaultAuthenticatedRole', {
            assumedBy: new iam.FederatedPrincipal('cognito-identity.amazonaws.com', {
                "StringEquals": { "cognito-identity.amazonaws.com:aud": props.cognitoIdentityPoolStack.identityPool.ref },
                "ForAnyValue:StringLike": { "cognito-identity.amazonaws.com:amr": "authenticated" },
            }, "sts:AssumeRoleWithWebIdentity"),
        });
        authenticatedDefaultRole.addToPolicy(new aws_iam_1.PolicyStatement({
            effect: aws_iam_1.Effect.ALLOW,
            actions: [
                "mobileanalytics:PutEvents",
                "cognito-sync:*",
                "cognito-identity:*"
            ],
            resources: ["*"],
        }));
        // ============================================================================================
        // Resource: RoleMapper
        //    Create a mapping of roles from your provider JWT user claims to the IAM roles you created 
        //    in your web service stack.
        //    Rule of Thumb: You should maybe have a mapping for each user role.
        // ============================================================================================
        let roleMap = new role_mapper_1.RoleMapper();
        roleMap.addMapping({
            claim: props.cognitoAttr,
            matchType: eMatchTypes_1.eMatchTypes.CONTAINS,
            roleArn: props.webServiceStack.adminRole.roleArn,
            value: "admin" // user claim reference that should be on JWT
        });
        roleMap.addMapping({
            claim: props.cognitoAttr,
            matchType: eMatchTypes_1.eMatchTypes.CONTAINS,
            roleArn: props.webServiceStack.userRole.roleArn,
            value: "user" // user claim reference that should be on JWT.
        });
        // ========================================================================
        // Resource: Amazon Cognito Identity Pool Role Attachment
        // ========================================================================
        // Purpose: Map an external user claim to IAM Role ARN
        // See also:
        // - https://aws.amazon.com/cognito/
        // - vhttps://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolroleattachment.html
        const roleAttachment = new aws_cognito_1.CfnIdentityPoolRoleAttachment(this, "CustomRoleAttachmentFunction", {
            identityPoolId: props.cognitoIdentityPoolStack.identityPool.ref,
            roles: {
                'unauthenticated': unauthenticatedDefaultRole.roleArn,
                'authenticated': authenticatedDefaultRole.roleArn
            },
            roleMappings: {
                [props.providerName]: {
                    identityProvider: 'cognito-idp.' + this.region + '.amazonaws.com/' + props.cognitoIdentityPoolStack.userPool.userPoolId + ':' + props.cognitoIdentityPoolStack.userPoolClient.ref,
                    ambiguousRoleResolution: 'Deny',
                    type: 'Rules',
                    rulesConfiguration: {
                        rules: roleMap.getRules()
                    }
                }
            }
        });
    }
}
exports.CognitoRbacRoleMappingStack = CognitoRbacRoleMappingStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29nbml0by1yYmFjLXJvbGVtYXBwaW5ncy1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvZ25pdG8tcmJhYy1yb2xlbWFwcGluZ3Mtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBcUM7QUFDckMsd0NBQXlDO0FBQ3pDLHNEQUFxRTtBQUNyRSw4Q0FJMEI7QUFHMUIscURBQWtEO0FBRWxELGlCQUFpQjtBQUNqQixxREFBaUQ7QUFVakQsTUFBYSwyQkFBNEIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUV4RDs7Ozs7Ozs7Ozs7Ozs7T0FjRztJQUVILFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBbUM7UUFDL0UsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsK0ZBQStGO1FBQy9GLCtCQUErQjtRQUMvQixxREFBcUQ7UUFDckQsc0ZBQXNGO1FBQ3RGLCtGQUErRjtRQUUvRixNQUFNLDBCQUEwQixHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsbUNBQW1DLEVBQUU7WUFDekYsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLGtCQUFrQixDQUFDLGdDQUFnQyxFQUFFO2dCQUN0RSxjQUFjLEVBQUUsRUFBRSxvQ0FBb0MsRUFBRSxLQUFLLENBQUMsd0JBQXdCLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRTtnQkFDekcsd0JBQXdCLEVBQUUsRUFBRSxvQ0FBb0MsRUFBRSxpQkFBaUIsRUFBRTthQUN0RixFQUFFLCtCQUErQixDQUFDO1NBQ3BDLENBQUMsQ0FBQztRQUNILDBCQUEwQixDQUFDLFdBQVcsQ0FBQyxJQUFJLHlCQUFlLENBQUM7WUFDekQsTUFBTSxFQUFFLGdCQUFNLENBQUMsS0FBSztZQUNwQixPQUFPLEVBQUU7Z0JBQ1AsMkJBQTJCO2dCQUMzQixnQkFBZ0I7YUFDakI7WUFDRCxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7U0FDakIsQ0FBQyxDQUFDLENBQUM7UUFFSixNQUFNLHdCQUF3QixHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsaUNBQWlDLEVBQUU7WUFDckYsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLGtCQUFrQixDQUFDLGdDQUFnQyxFQUFFO2dCQUN0RSxjQUFjLEVBQUUsRUFBRSxvQ0FBb0MsRUFBRSxLQUFLLENBQUMsd0JBQXdCLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRTtnQkFDekcsd0JBQXdCLEVBQUUsRUFBRSxvQ0FBb0MsRUFBRSxlQUFlLEVBQUU7YUFDcEYsRUFBRSwrQkFBK0IsQ0FBQztTQUNwQyxDQUFDLENBQUM7UUFFSCx3QkFBd0IsQ0FBQyxXQUFXLENBQUMsSUFBSSx5QkFBZSxDQUFDO1lBQ3ZELE1BQU0sRUFBRSxnQkFBTSxDQUFDLEtBQUs7WUFDcEIsT0FBTyxFQUFFO2dCQUNQLDJCQUEyQjtnQkFDM0IsZ0JBQWdCO2dCQUNoQixvQkFBb0I7YUFDckI7WUFDRCxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7U0FDakIsQ0FBQyxDQUFDLENBQUM7UUFFSiwrRkFBK0Y7UUFDL0YsdUJBQXVCO1FBQ3ZCLGdHQUFnRztRQUNoRyxnQ0FBZ0M7UUFDaEMsd0VBQXdFO1FBQ3hFLCtGQUErRjtRQUMvRixJQUFJLE9BQU8sR0FBRyxJQUFJLHdCQUFVLEVBQUUsQ0FBQztRQUUvQixPQUFPLENBQUMsVUFBVSxDQUFDO1lBQ2pCLEtBQUssRUFBRSxLQUFLLENBQUMsV0FBVztZQUN4QixTQUFTLEVBQUUseUJBQVcsQ0FBQyxRQUFRO1lBQy9CLE9BQU8sRUFBRSxLQUFLLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxPQUFPO1lBQ2hELEtBQUssRUFBRSxPQUFPLENBQUMsNkNBQTZDO1NBQzdELENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxVQUFVLENBQUM7WUFDakIsS0FBSyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQ3hCLFNBQVMsRUFBRSx5QkFBVyxDQUFDLFFBQVE7WUFDL0IsT0FBTyxFQUFFLEtBQUssQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLE9BQU87WUFDL0MsS0FBSyxFQUFFLE1BQU0sQ0FBQyw4Q0FBOEM7U0FDN0QsQ0FBQyxDQUFDO1FBRUgsMkVBQTJFO1FBQzNFLHlEQUF5RDtRQUN6RCwyRUFBMkU7UUFDM0Usc0RBQXNEO1FBQ3RELFlBQVk7UUFDWixvQ0FBb0M7UUFDcEMseUhBQXlIO1FBRXpILE1BQU0sY0FBYyxHQUFHLElBQUksMkNBQTZCLENBQUMsSUFBSSxFQUFFLDhCQUE4QixFQUFFO1lBQzdGLGNBQWMsRUFBRSxLQUFLLENBQUMsd0JBQXdCLENBQUMsWUFBWSxDQUFDLEdBQUc7WUFDL0QsS0FBSyxFQUFFO2dCQUNMLGlCQUFpQixFQUFFLDBCQUEwQixDQUFDLE9BQU87Z0JBQ3JELGVBQWUsRUFBRSx3QkFBd0IsQ0FBQyxPQUFPO2FBQ2xEO1lBQ0QsWUFBWSxFQUFFO2dCQUNaLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFFO29CQUNwQixnQkFBZ0IsRUFBRSxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxpQkFBaUIsR0FBRyxLQUFLLENBQUMsd0JBQXdCLENBQUMsUUFBUSxDQUFDLFVBQVUsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLHdCQUF3QixDQUFDLGNBQWMsQ0FBQyxHQUFHO29CQUNqTCx1QkFBdUIsRUFBRSxNQUFNO29CQUMvQixJQUFJLEVBQUUsT0FBTztvQkFDYixrQkFBa0IsRUFBRTt3QkFDbEIsS0FBSyxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUU7cUJBQzFCO2lCQUNGO2FBQ0Y7U0FFRixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0Y7QUE1R0Qsa0VBNEdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IGlhbSA9IHJlcXVpcmUoXCJAYXdzLWNkay9hd3MtaWFtXCIpO1xuaW1wb3J0IHsgQ2ZuSWRlbnRpdHlQb29sUm9sZUF0dGFjaG1lbnQgfSBmcm9tIFwiQGF3cy1jZGsvYXdzLWNvZ25pdG9cIjtcbmltcG9ydCB7XG4gIFJvbGUsXG4gIFBvbGljeVN0YXRlbWVudCxcbiAgRWZmZWN0XG59IGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgQ29nbml0b0lkZW50aXR5UG9vbFN0YWNrIH0gZnJvbSAnLi9jb2duaXRvLWlkZW50aXR5LXBvb2wtc3RhY2snO1xuaW1wb3J0IHsgTGVhc3RQcml2aWxlZ2VXZWJzZXJ2aWNlU3RhY2sgfSBmcm9tICcuL2xlYXN0LXByaXZpbGVnZS13ZWJzZXJ2aWNlLXN0YWNrJztcbmltcG9ydCB7IGVNYXRjaFR5cGVzIH0gZnJvbSAnLi9lbnVtcy9lTWF0Y2hUeXBlcyc7XG5cbi8vIEhlbHBlciBDbGFzc2VzXG5pbXBvcnQgeyBSb2xlTWFwcGVyIH0gZnJvbSBcIi4uL3V0aWwvcm9sZS1tYXBwZXJcIjtcblxuaW50ZXJmYWNlIENvZ25pdG9SYmFjUm9sZU1hcHBpbmdsUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIGNvZ25pdG9JZGVudGl0eVBvb2xTdGFjazogQ29nbml0b0lkZW50aXR5UG9vbFN0YWNrO1xuICBjb2duaXRvQXR0cjogc3RyaW5nO1xuICB3ZWJTZXJ2aWNlU3RhY2s6IExlYXN0UHJpdmlsZWdlV2Vic2VydmljZVN0YWNrO1xuICBwcm92aWRlck5hbWU6IHN0cmluZztcbiAgbWFwcGluZ0F0dHI6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIENvZ25pdG9SYmFjUm9sZU1hcHBpbmdTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG5cbiAgLyoqXG4gICAqICBDb2duaXRvUmJhY1JvbGVNYXBwaW5nU3RhY2sgKGNkay5zdGFjaylcbiAgICogXG4gICAqICBUaGlzIHN0YWNrIHdpbGwgY3JlYXRlIHRoZSByb2xlcyBmb3IgYWNjZXNzaW5nIG91ciBXZWIgQVBJIEdhdGV3YXkgTWV0aG9kc1xuICAgKiBcbiAgICogIFdlIHdpbGwgY3JlYXRlIHR3byByb2xlc1xuICAgKiAgICAtIEFkbWluIFJvbGUgKENhbiBwdXQgcmVjb3JkcyBpbnRvIER5bmFtb0RCLCBDYW4gY2FsbCB1cGRhdGUgJiByZWFkIGVuZHBvaW50KVxuICAgKiAgICAtIFJlYWQgUm9sZSAoQ2FuIHJlYWQgYSByZWNvcmQgZnJvbSBhIER5bmFtb0RCLCBDYW4gY2FsbCByZWFkIGVuZHBvaW50KVxuICAgKiBcbiAgICogIFdlIHdpbGwgYWxsb3cgYm90aCByb2xlcyB0byBiZSBhc3N1bWVkLWJ5IHRoZSBDb2duaXRvIElkZW50aXR5IFBvb2xcbiAgICogXG4gICAqICBXZSB3aWxsIHRoZW4gc2V0dXAgdGhlIEFXUy1Db2duaXRvLUlkZW50aXR5LVBvb2wgUm9sZU1hcHBpbmcgQXR0YWNobWVudHNcbiAgICogICAgLSBQb3N0IEF1dGhlbnRpY2F0aW9uIHRoaXMgaXMgaG93IHRoZSBJZGVudGl0eSBQb29sIHdpbGwgYXNzaWduIHRoZSByb2xlIHRvIHRoZSBhdXRoZW50aWNhdGVkIFVzZXJcbiAgICogXG4gICAqL1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ29nbml0b1JiYWNSb2xlTWFwcGluZ2xQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyAgICBSZXNvdXJjZTogQVdTOjpJQU06OlJvbGUgXG4gICAgLy8gICAgICAgIFRoZSBEZWFmdWx0IElBTSBSb2xlcyBmb3IgdGhlIElkZW50aXR5IFBvb2xcbiAgICAvLyAgICAgICAgVE9ETyBTaG91bGQgYmUgZ2V0dGluZyByaWQgb2YgdGhlc2UgYmFzZWQgb24gdGhlIHJlZmFjdG9ydGluZyBvZiB0aGlzIHN0YWNrLlxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBjb25zdCB1bmF1dGhlbnRpY2F0ZWREZWZhdWx0Um9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnQ29nbml0b0RlZmF1bHRVbmF1dGhlbnRpY2F0ZWRSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkZlZGVyYXRlZFByaW5jaXBhbCgnY29nbml0by1pZGVudGl0eS5hbWF6b25hd3MuY29tJywge1xuICAgICAgICBcIlN0cmluZ0VxdWFsc1wiOiB7IFwiY29nbml0by1pZGVudGl0eS5hbWF6b25hd3MuY29tOmF1ZFwiOiBwcm9wcy5jb2duaXRvSWRlbnRpdHlQb29sU3RhY2suaWRlbnRpdHlQb29sLnJlZiB9LFxuICAgICAgICBcIkZvckFueVZhbHVlOlN0cmluZ0xpa2VcIjogeyBcImNvZ25pdG8taWRlbnRpdHkuYW1hem9uYXdzLmNvbTphbXJcIjogXCJ1bmF1dGhlbnRpY2F0ZWRcIiB9LFxuICAgICAgfSwgXCJzdHM6QXNzdW1lUm9sZVdpdGhXZWJJZGVudGl0eVwiKSxcbiAgICB9KTtcbiAgICB1bmF1dGhlbnRpY2F0ZWREZWZhdWx0Um9sZS5hZGRUb1BvbGljeShuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGVmZmVjdDogRWZmZWN0LkFMTE9XLFxuICAgICAgYWN0aW9uczogW1xuICAgICAgICBcIm1vYmlsZWFuYWx5dGljczpQdXRFdmVudHNcIixcbiAgICAgICAgXCJjb2duaXRvLXN5bmM6KlwiXG4gICAgICBdLFxuICAgICAgcmVzb3VyY2VzOiBbXCIqXCJdLFxuICAgIH0pKTtcblxuICAgIGNvbnN0IGF1dGhlbnRpY2F0ZWREZWZhdWx0Um9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnQ29nbml0b0RlZmF1bHRBdXRoZW50aWNhdGVkUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5GZWRlcmF0ZWRQcmluY2lwYWwoJ2NvZ25pdG8taWRlbnRpdHkuYW1hem9uYXdzLmNvbScsIHtcbiAgICAgICAgXCJTdHJpbmdFcXVhbHNcIjogeyBcImNvZ25pdG8taWRlbnRpdHkuYW1hem9uYXdzLmNvbTphdWRcIjogcHJvcHMuY29nbml0b0lkZW50aXR5UG9vbFN0YWNrLmlkZW50aXR5UG9vbC5yZWYgfSxcbiAgICAgICAgXCJGb3JBbnlWYWx1ZTpTdHJpbmdMaWtlXCI6IHsgXCJjb2duaXRvLWlkZW50aXR5LmFtYXpvbmF3cy5jb206YW1yXCI6IFwiYXV0aGVudGljYXRlZFwiIH0sXG4gICAgICB9LCBcInN0czpBc3N1bWVSb2xlV2l0aFdlYklkZW50aXR5XCIpLFxuICAgIH0pO1xuXG4gICAgYXV0aGVudGljYXRlZERlZmF1bHRSb2xlLmFkZFRvUG9saWN5KG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgZWZmZWN0OiBFZmZlY3QuQUxMT1csXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgIFwibW9iaWxlYW5hbHl0aWNzOlB1dEV2ZW50c1wiLFxuICAgICAgICBcImNvZ25pdG8tc3luYzoqXCIsXG4gICAgICAgIFwiY29nbml0by1pZGVudGl0eToqXCJcbiAgICAgIF0sXG4gICAgICByZXNvdXJjZXM6IFtcIipcIl0sXG4gICAgfSkpO1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBSZXNvdXJjZTogUm9sZU1hcHBlclxuICAgIC8vICAgIENyZWF0ZSBhIG1hcHBpbmcgb2Ygcm9sZXMgZnJvbSB5b3VyIHByb3ZpZGVyIEpXVCB1c2VyIGNsYWltcyB0byB0aGUgSUFNIHJvbGVzIHlvdSBjcmVhdGVkIFxuICAgIC8vICAgIGluIHlvdXIgd2ViIHNlcnZpY2Ugc3RhY2suXG4gICAgLy8gICAgUnVsZSBvZiBUaHVtYjogWW91IHNob3VsZCBtYXliZSBoYXZlIGEgbWFwcGluZyBmb3IgZWFjaCB1c2VyIHJvbGUuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBsZXQgcm9sZU1hcCA9IG5ldyBSb2xlTWFwcGVyKCk7XG5cbiAgICByb2xlTWFwLmFkZE1hcHBpbmcoe1xuICAgICAgY2xhaW06IHByb3BzLmNvZ25pdG9BdHRyLFxuICAgICAgbWF0Y2hUeXBlOiBlTWF0Y2hUeXBlcy5DT05UQUlOUyxcbiAgICAgIHJvbGVBcm46IHByb3BzLndlYlNlcnZpY2VTdGFjay5hZG1pblJvbGUucm9sZUFybixcbiAgICAgIHZhbHVlOiBcImFkbWluXCIgLy8gdXNlciBjbGFpbSByZWZlcmVuY2UgdGhhdCBzaG91bGQgYmUgb24gSldUXG4gICAgfSk7XG5cbiAgICByb2xlTWFwLmFkZE1hcHBpbmcoe1xuICAgICAgY2xhaW06IHByb3BzLmNvZ25pdG9BdHRyLFxuICAgICAgbWF0Y2hUeXBlOiBlTWF0Y2hUeXBlcy5DT05UQUlOUyxcbiAgICAgIHJvbGVBcm46IHByb3BzLndlYlNlcnZpY2VTdGFjay51c2VyUm9sZS5yb2xlQXJuLFxuICAgICAgdmFsdWU6IFwidXNlclwiIC8vIHVzZXIgY2xhaW0gcmVmZXJlbmNlIHRoYXQgc2hvdWxkIGJlIG9uIEpXVC5cbiAgICB9KTtcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIFJlc291cmNlOiBBbWF6b24gQ29nbml0byBJZGVudGl0eSBQb29sIFJvbGUgQXR0YWNobWVudFxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIFB1cnBvc2U6IE1hcCBhbiBleHRlcm5hbCB1c2VyIGNsYWltIHRvIElBTSBSb2xlIEFSTlxuICAgIC8vIFNlZSBhbHNvOlxuICAgIC8vIC0gaHR0cHM6Ly9hd3MuYW1hem9uLmNvbS9jb2duaXRvL1xuICAgIC8vIC0gdmh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1jb2duaXRvLWlkZW50aXR5cG9vbHJvbGVhdHRhY2htZW50Lmh0bWxcblxuICAgIGNvbnN0IHJvbGVBdHRhY2htZW50ID0gbmV3IENmbklkZW50aXR5UG9vbFJvbGVBdHRhY2htZW50KHRoaXMsIFwiQ3VzdG9tUm9sZUF0dGFjaG1lbnRGdW5jdGlvblwiLCB7XG4gICAgICBpZGVudGl0eVBvb2xJZDogcHJvcHMuY29nbml0b0lkZW50aXR5UG9vbFN0YWNrLmlkZW50aXR5UG9vbC5yZWYsXG4gICAgICByb2xlczoge1xuICAgICAgICAndW5hdXRoZW50aWNhdGVkJzogdW5hdXRoZW50aWNhdGVkRGVmYXVsdFJvbGUucm9sZUFybixcbiAgICAgICAgJ2F1dGhlbnRpY2F0ZWQnOiBhdXRoZW50aWNhdGVkRGVmYXVsdFJvbGUucm9sZUFyblxuICAgICAgfSxcbiAgICAgIHJvbGVNYXBwaW5nczoge1xuICAgICAgICBbcHJvcHMucHJvdmlkZXJOYW1lXToge1xuICAgICAgICAgIGlkZW50aXR5UHJvdmlkZXI6ICdjb2duaXRvLWlkcC4nICsgdGhpcy5yZWdpb24gKyAnLmFtYXpvbmF3cy5jb20vJyArIHByb3BzLmNvZ25pdG9JZGVudGl0eVBvb2xTdGFjay51c2VyUG9vbC51c2VyUG9vbElkICsgJzonICsgcHJvcHMuY29nbml0b0lkZW50aXR5UG9vbFN0YWNrLnVzZXJQb29sQ2xpZW50LnJlZiwgIC8vY29nbml0by1pZHAuJHtTdGFjay5vZih0aGlzKS5yZWdpb259LmFtYXpvbmF3cy5jb20vJHtwb29sLnVzZXJQb29sSWR9OiR7Y2xpZW50LnVzZXJQb29sQ2xpZW50SWR9XG4gICAgICAgICAgYW1iaWd1b3VzUm9sZVJlc29sdXRpb246ICdEZW55JyxcbiAgICAgICAgICB0eXBlOiAnUnVsZXMnLFxuICAgICAgICAgIHJ1bGVzQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgcnVsZXM6IHJvbGVNYXAuZ2V0UnVsZXMoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfSlcbiAgfVxufSJdfQ==