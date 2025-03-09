import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

interface WeChatProfile {
  openid: string;
  nickname: string;
  sex: number;
  language: string;
  city: string;
  province: string;
  country: string;
  headimgurl: string;
  privilege: string[];
  unionid?: string;
}

export default function WeChatProvider<P extends WeChatProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "wechat",
    name: "WeChat",
    type: "oauth",
    wellKnown: "https://open.weixin.qq.com/.well-known/openid-configuration",
    authorization: {
      url: "https://open.weixin.qq.com/connect/qrconnect",
      params: {
        appid: options.clientId,
        redirect_uri: options.callbackUrl,
        response_type: "code",
        scope: "snsapi_login",
      },
    },
    token: {
      url: "https://api.weixin.qq.com/sns/oauth2/access_token",
      params: {
        appid: options.clientId,
        secret: options.clientSecret,
        grant_type: "authorization_code",
      },
    },
    userinfo: {
      url: "https://api.weixin.qq.com/sns/userinfo",
      params: {
        openid: { param: "openid" },
        access_token: { param: "access_token" },
        lang: "zh_CN",
      },
    },
    profile(profile) {
      return {
        id: profile.openid,
        name: profile.nickname,
        image: profile.headimgurl,
        wechatId: profile.openid,
      };
    },
    style: {
      logo: "/wechat.svg",
      logoDark: "/wechat.svg",
      bg: "#2DC100",
      text: "#fff",
      bgDark: "#2DC100",
      textDark: "#fff",
    },
    options,
  };
} 