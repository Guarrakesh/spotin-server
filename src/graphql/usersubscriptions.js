const { verifyRecaptchaV3 } = require('../api/utils/google');
const { UserSubscription } = require('../api/models/usersubscription.model');
const mailer = require('../api/utils/nodemailer');
const { email: { noreplyMail, infoMail } } = require('../config/vars');

exports.UserSubscription = `
  
  
  input UserSubscribeInput {
    email: String!
    businessType: [String]
    recaptchaToken: String!
  }
  type UserSubscription {
    email: String!
    businessType: [String]
    createdAt: String
  }
  type SubscriptionResponse {
    subscription: UserSubscription
    ok: Boolean!
    errorCode: Int
  } 
  extend type Mutation {
    subscribe(input: UserSubscribeInput): SubscriptionResponse
  } 
 
`;

exports.userSubscriptionResolvers = {

  Mutation: {
    async subscribe(obj, args) {
      if (!args.input) {
        return { ok: false };
      }

      let {email, businessType, recaptchaToken} = args.input;
      const response = await verifyRecaptchaV3(recaptchaToken);
      if (typeof businessType === "string") {
        businessType = [businessType];
      }
      if (1 === 1 ) {
        const options = businessType
            ? { email: email.toLowerCase(), "businessType.0": { $exists: true }}
            : { email: email.toLowerCase() };
        if ((await UserSubscription.findOne(options))) {
          return {
            ok: false,
            errorCode: 10 // email già esistente
          }
        }
        const subscription = new UserSubscription({
          email: email.toLowerCase(), businessType
        });
        await subscription.save();
        // send email
        const data = {
          to: subscription.email,
          from: infoMail ,
          replyTo: infoMail,
          inReplyTo: "Spot In",
          template: businessType ? 'business-subscription' : 'user-subscription',
          subject: "Benvenuto tra noi | Spot In",
          context: {
            subscription,
          }
        };
        try {
          await mailer.sendMail(data);
        } catch (e) {
          console.error(e);
        }

        return { ok: true, subscription }
      } else {
        return {ok: false, errorCode: 11}
      }

    }
  },




};
