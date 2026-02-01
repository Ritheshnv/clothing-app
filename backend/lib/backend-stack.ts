import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as iam from 'aws-cdk-lib/aws-iam';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ordersTable = new dynamodb.Table(this, 'OrdersTable', {
      tableName: 'dihana-orders',
      partitionKey: { name: 'orderId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
    });

    // SES Email Identity
    const emailIdentity = new ses.EmailIdentity(this, 'DihanaCoutureEmail', {
      identity: ses.Identity.email('info@dihanacouture.com')
    });

    const getOrderLambda = new lambda.Function(this, 'GetOrderFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      environment: {
        TABLE_NAME: ordersTable.tableName
      },
      code: lambda.Code.fromInline(`
        const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
        const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');
        
        const client = new DynamoDBClient({});
        const dynamodb = DynamoDBDocumentClient.from(client);

        exports.handler = async (event) => {
          const orderId = event.pathParameters.orderId;
          
          try {
            const result = await dynamodb.send(new GetCommand({
              TableName: process.env.TABLE_NAME,
              Key: { orderId }
            }));
            
            return {
              statusCode: 200,
              headers: { 
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
              },
              body: JSON.stringify(result.Item || { error: 'Order not found' })
            };
          } catch (error) {
            console.error('Error:', error);
            return {
              statusCode: 500,
              headers: { 
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
              },
              body: JSON.stringify({ error: error.message })
            };
          }
        };
      `)
    });

    ordersTable.grantReadData(getOrderLambda);

    // Create Order Lambda
    const createOrderLambda = new lambda.Function(this, 'CreateOrderFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      environment: {
        TABLE_NAME: ordersTable.tableName
      },
      code: lambda.Code.fromInline(`
        const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
        const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
        const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
        
        const client = new DynamoDBClient({});
        const dynamodb = DynamoDBDocumentClient.from(client);
        const sesClient = new SESClient({});

        exports.handler = async (event) => {
          try {
            const orderData = JSON.parse(event.body);
            const orderId = 'ORD-' + Date.now();
            
            const order = {
              orderId,
              userId: orderData.userId,
              items: orderData.items,
              totalAmount: orderData.totalAmount,
              shippingAddress: {
                fullName: orderData.shippingAddress.fullName,
                phone: orderData.shippingAddress.phone,
                address: orderData.shippingAddress.address,
                city: orderData.shippingAddress.city,
                state: orderData.shippingAddress.state,
                pincode: orderData.shippingAddress.pincode,
                landmark: orderData.shippingAddress.landmark || ''
              },
              status: 'placed',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              trackingNumber: 'TRK' + Date.now(),
              estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            };
            
            await dynamodb.send(new PutCommand({
              TableName: process.env.TABLE_NAME,
              Item: order
            }));
            
            // Send confirmation email
            try {
              const emailParams = {
                Source: 'info@dihanacouture.com',
                Destination: {
                  ToAddresses: [orderData.userEmail],
                  CcAddresses: ['info@dihanacouture.com']
                },
                Message: {
                  Subject: {
                    Data: \`Order Confirmation - \${orderId}\`,
                    Charset: 'UTF-8'
                  },
                  Body: {
                    Html: {
                      Data: \`
                        <h2>Order Confirmation</h2>
                        <p>Dear \${orderData.shippingAddress.fullName},</p>
                        <p>Thank you for your order! Your order has been successfully placed.</p>
                        
                        <h3>Order Details:</h3>
                        <p><strong>Order ID:</strong> \${orderId}</p>
                        <p><strong>Tracking Number:</strong> \${order.trackingNumber}</p>
                        <p><strong>Total Amount:</strong> ₹\${order.totalAmount}</p>
                        <p><strong>Estimated Delivery:</strong> \${new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                        
                        <h3>Items Ordered:</h3>
                        \${orderData.items.map(item => \`
                          <p>• \${item.name} x \${item.quantity} - ₹\${item.price}</p>
                        \`).join('')}
                        
                        <h3>Shipping Address:</h3>
                        <p>\${orderData.shippingAddress.fullName}<br>
                        \${orderData.shippingAddress.address}<br>
                        \${orderData.shippingAddress.city}, \${orderData.shippingAddress.state} \${orderData.shippingAddress.pincode}<br>
                        Phone: \${orderData.shippingAddress.phone}</p>
                        
                        <p>We will send you updates as your order progresses.</p>
                        <p>Thank you for choosing Dihana Couture!</p>
                        
                        <p>Best regards,<br>Dihana Couture Team</p>
                      \`,
                      Charset: 'UTF-8'
                    }
                  }
                }
              };
              
              await sesClient.send(new SendEmailCommand(emailParams));
            } catch (emailError) {
              console.error('Email sending failed:', emailError);
              // Don't fail the order if email fails
            }
            
            return {
              statusCode: 200,
              headers: { 
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
              },
              body: JSON.stringify({ orderId, message: 'Order placed successfully' })
            };
          } catch (error) {
            console.error('Error:', error);
            return {
              statusCode: 500,
              headers: { 
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
              },
              body: JSON.stringify({ error: error.message })
            };
          }
        };
      `)
    });

    ordersTable.grantWriteData(createOrderLambda);
    
    // Grant SES permissions to create order lambda
    createOrderLambda.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['ses:SendEmail', 'ses:SendRawEmail'],
      resources: ['*']
    }));

    // Get User Orders Lambda
    const getUserOrdersLambda = new lambda.Function(this, 'GetUserOrdersFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      environment: {
        TABLE_NAME: ordersTable.tableName
      },
      code: lambda.Code.fromInline(`
        const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
        const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
        
        const client = new DynamoDBClient({});
        const dynamodb = DynamoDBDocumentClient.from(client);

        exports.handler = async (event) => {
          const userId = event.pathParameters.userId;
          
          try {
            const result = await dynamodb.send(new ScanCommand({
              TableName: process.env.TABLE_NAME,
              FilterExpression: 'userId = :userId',
              ExpressionAttributeValues: {
                ':userId': userId
              }
            }));
            
            return {
              statusCode: 200,
              headers: { 
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
              },
              body: JSON.stringify(result.Items || [])
            };
          } catch (error) {
            console.error('Error:', error);
            return {
              statusCode: 500,
              headers: { 
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
              },
              body: JSON.stringify({ error: error.message })
            };
          }
        };
      `)
    });

    ordersTable.grantReadData(getUserOrdersLambda);

    // Update Order Status Lambda
    const updateOrderStatusLambda = new lambda.Function(this, 'UpdateOrderStatusFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      environment: {
        TABLE_NAME: ordersTable.tableName
      },
      code: lambda.Code.fromInline(`
        const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
        const { DynamoDBDocumentClient, UpdateCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
        const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
        
        const client = new DynamoDBClient({});
        const dynamodb = DynamoDBDocumentClient.from(client);
        const sesClient = new SESClient({});

        exports.handler = async (event) => {
          const orderId = event.pathParameters.orderId;
          
          try {
            const { status } = JSON.parse(event.body);
            
            const result = await dynamodb.send(new UpdateCommand({
              TableName: process.env.TABLE_NAME,
              Key: { orderId },
              UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
              ExpressionAttributeNames: {
                '#status': 'status'
              },
              ExpressionAttributeValues: {
                ':status': status,
                ':updatedAt': new Date().toISOString()
              },
              ReturnValues: 'ALL_NEW'
            }));
            
            // Send status update email if order has user email
            if (result.Attributes && result.Attributes.userEmail) {
              try {
                const statusMessages = {
                  shipped: 'Your order has been shipped!',
                  in_transit: 'Your order is in transit',
                  out_for_delivery: 'Your order is out for delivery',
                  delivered: 'Your order has been delivered!'
                };
                
                if (statusMessages[status]) {
                  const emailParams = {
                    Source: 'info@dihanacouture.com',
                    Destination: {
                      ToAddresses: [result.Attributes.userEmail],
                      CcAddresses: ['info@dihanacouture.com']
                    },
                    Message: {
                      Subject: {
                        Data: \`Order Update - \${orderId}\`,
                        Charset: 'UTF-8'
                      },
                      Body: {
                        Html: {
                          Data: \`
                            <h2>Order Status Update</h2>
                            <p>Dear \${result.Attributes.shippingAddress.fullName},</p>
                            <p>\${statusMessages[status]}</p>
                            
                            <h3>Order Details:</h3>
                            <p><strong>Order ID:</strong> \${orderId}</p>
                            <p><strong>Status:</strong> \${status.replace('_', ' ').toUpperCase()}</p>
                            <p><strong>Tracking Number:</strong> \${result.Attributes.trackingNumber}</p>
                            
                            <p>You can track your order anytime on our website.</p>
                            <p>Thank you for choosing Dihana Couture!</p>
                            
                            <p>Best regards,<br>Dihana Couture Team</p>
                          \`,
                          Charset: 'UTF-8'
                        }
                      }
                    }
                  };
                  
                  await sesClient.send(new SendEmailCommand(emailParams));
                }
              } catch (emailError) {
                console.error('Status update email failed:', emailError);
              }
            }
            
            return {
              statusCode: 200,
              headers: { 
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
              },
              body: JSON.stringify({ message: 'Order status updated successfully', order: result.Attributes })
            };
          } catch (error) {
            console.error('Error:', error);
            return {
              statusCode: 500,
              headers: { 
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
              },
              body: JSON.stringify({ error: error.message })
            };
          }
        };
      `)
    });

    ordersTable.grantWriteData(updateOrderStatusLambda);
    
    // Grant SES permissions to update order status lambda
    updateOrderStatusLambda.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['ses:SendEmail', 'ses:SendRawEmail'],
      resources: ['*']
    }));

    const api = new apigateway.RestApi(this, 'OrderTrackingApi', {
      restApiName: 'Dihana Order Tracking',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization']
      }
    });

    const orders = api.root.addResource('orders');
    const order = orders.addResource('{orderId}');
    order.addMethod('GET', new apigateway.LambdaIntegration(getOrderLambda));
    order.addMethod('PUT', new apigateway.LambdaIntegration(updateOrderStatusLambda));
    orders.addMethod('POST', new apigateway.LambdaIntegration(createOrderLambda));
    
    const userOrders = orders.addResource('user').addResource('{userId}');
    userOrders.addMethod('GET', new apigateway.LambdaIntegration(getUserOrdersLambda));
  }
}