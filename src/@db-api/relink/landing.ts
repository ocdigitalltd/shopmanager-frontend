import toast from "react-hot-toast";
import bkUrl from "src/configs/bkUrl";

export const redirectDomainToBusiness = async (domain: string, orderNum: number) => {
  let url = ""
  try {
    const response = await fetch(`${bkUrl}/relink/redirectDomain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: "jwt=your_jwt_token_here",
      },
      body: JSON.stringify({
        domain, orderNum
      }),
    });

    if (response.ok) {
      const result = await response.json();
      const redirect = (result as any)?.url
      if (redirect && redirect?.startsWith("http")) {
        url = redirect
      } else if (redirect.startsWith("Product") || redirect.startsWith("Invalid")) {
        toast.error(redirect, {
          duration: 3000
        });
      }
    } else {
      toast.error('Something went wrong, please try again in some time or contact us', {
        duration: 3000
      });
    }

    return url
  } catch (error) {
    console.error("Error in redirectDomainToBusiness:", error);
  }
}

export const redirectDomainToBusinessLanding2 = async (
  data: { email: string, businessUrl: string, businessUrlType: string, name: string, phone?: string },
  domain: string) => {
  let url = ""
  try {
    const response = await fetch(`${bkUrl}/relink/redirectDomain/landing2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: "jwt=your_jwt_token_here",
      },
      body: JSON.stringify({
        ...data, domain
      }),
    });

    if (response.ok) {
      const result = await response.json();
      const redirect = (result as any)?.url
      if (redirect && redirect?.startsWith("http")) {
        url = redirect
      } else if (redirect.startsWith("Product") || redirect.startsWith("Invalid")) {
        toast.error(redirect, {
          duration: 3000
        });
      }
    } else {
      toast.error('Something went wrong, please try again in some time or contact us', {
        duration: 3000
      });
    }

    return url
  } catch (error) {
    console.error("Error in redirectDomainToBusinessLanding2:", error);
  }
}

export const getMisprintedCardInfo = async (
  domain: string) => {
  let url = ""
  try {
    console.time("apiGet")
    const response = await fetch(`${bkUrl}/misprinted-domain/${domain}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: "jwt=your_jwt_token_here",
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log({result})
      const redirect = (result as any)?.domain?.businessurl
      console.log({ redirect })
      if (redirect && redirect?.startsWith("http")) {
        url = redirect
      }
    } 
    console.timeEnd("apiGet")
    
    return url
  } catch (error) {
    console.error("Error in redirectDomainToBusinessLanding2:", error);
  }
}

export const redirectMisprintedDomainToBusinessUrl = async (
  data: { email: string, businessUrl: string, businessUrlType: string, name: string, phone?: string },
  domain: string) => {
  let url = ""
  try {
    const response = await fetch(`${bkUrl}/relink/misprintRedirect/landing2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: "jwt=your_jwt_token_here",
      },
      body: JSON.stringify({
        ...data, domain
      }),
    });

    if (response.ok) {
      const result = await response.json();
      const redirect = (result as any)?.url
      if (redirect && redirect?.startsWith("http")) {
        url = redirect
      } else if (redirect.startsWith("Product") || redirect.startsWith("Invalid")) {
        toast.error(redirect, {
          duration: 3000
        });
      }
    } else {
      toast.error('Something went wrong, please try again in some time or contact us', {
        duration: 3000
      });
    }

    return url
  } catch (error) {
    console.error("Error in redirectDomainToBusinessLanding2:", error);
  }
}