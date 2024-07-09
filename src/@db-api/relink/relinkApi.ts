import toast from "react-hot-toast";
import bkUrl from "src/configs/bkUrl";
import { CustomerDomainsType, CustomerRowType } from "../types";

export const createBulkDomains = async (sku: string, numOfDomains: number, redirectType: string) => {
  try {
    const response = await fetch(`${bkUrl}/relink-email/bulk-domains`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: "jwt=your_jwt_token_here",
      },
      body: JSON.stringify({
        sku, numOfDomains, redirectType
      }),
    });

    if (response.ok) {
      const result = await response.json();
      toast.success((result as any)?.message ?? "Domains created successfully");

      return "ok"
    } else {
      toast.error('Could not create domains', {
        duration: 3000
      });
    }
  } catch (error) {
    console.error("Error in createBulkDomains:", error);
  }
}

export const createCustomer = async (data: CustomerRowType) => {
  try {
    const response = await fetch(`${bkUrl}/customer/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: "jwt=your_jwt_token_here",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      toast.success((result as any)?.message ?? "Customer created successfully");

      return "ok"
    } else {
      toast.error('Could not create customer', {
        duration: 3000
      });
    }
  } catch (error) {
    console.error("Error in createCustomer:", error);
  }
}

export const updateCustomer = async (id: string, data: CustomerRowType) => {
  try {
    const response = await fetch(`${bkUrl}/customer/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: "jwt=your_jwt_token_here",
      },
      body: JSON.stringify(
        { ...data, id }
      ),
    });

    if (response.ok) {
      const result = await response.json();
      toast.success((result as any)?.message ?? "Customer updated successfully");

      return "ok"
    } else {
      toast.error('Could not update customer', {
        duration: 3000
      });
    }
  } catch (error) {
    console.error("Error in updateCustomer:", error);
  }
}

export const addOtherDomainForCustomer = async (data: CustomerDomainsType) => {
  try {
    const response = await fetch(`${bkUrl}/customer/products/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: "jwt=your_jwt_token_here",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      toast.success((result as any)?.message ?? "Domain created for customer successfully");

      return "ok"
    } else {
      toast.error('Could not create domain for customer', {
        duration: 3000
      });
    }
  } catch (error) {
    console.error("Error in addOtherDomainForCustomer:", error);
  }
}

export const deleteCustomerDomain = async (id: string, onReloadData: () => void) => {
  try {
    const response = await fetch(`${bkUrl}/customer/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: "jwt=your_jwt_token_here",
      },
    });

    if (response.ok) {
      const result = await response.json();
      toast.success((result as any)?.message ?? "Domain deleted successfully");
      onReloadData()
    } else {
      toast.error('Could not delete domain', {
        duration: 2000
      });
    }
  } catch (error) {
    console.error("Error in deleteCustomerDomain:", error);
  }
}

export const deleteCustomer = async (id: string, onReloadData: () => void) => {
  try {
    const response = await fetch(`${bkUrl}/customer/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: "jwt=your_jwt_token_here",
      },
    });

    if (response.ok) {
      const result = await response.json();
      toast.success((result as any)?.message ?? "Deleted customer successfully")
      onReloadData();
    } else {
      toast.error('Error deleting customer', {
        duration: 2000
      });
    }
  } catch (error) {
    console.error("Error deleting customer:", error);
  }
}

export const deleteSku = async (id: string, onReloadData: () => void) => {
  try {
    const response = await fetch(`${bkUrl}/relink-email/sku/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: "jwt=your_jwt_token_here",
      },
    });

    if (response.ok) {
      const result = await response.json();
      toast.success((result as any)?.message ?? "SKU deleted successfully");
      onReloadData()
    } else {
      const result = await response.json();
      toast.error((result as any)?.message ?? 'Could not delete sku');
    }
  } catch (error) {
    console.error("Error in deleteSku:", error);
  }
}

export const deleteDomainById = async (id: string, onReloadData: () => void) => {
  try {
    const response = await fetch(`${bkUrl}/relink-email/domains/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: "jwt=your_jwt_token_here",
      },
    });

    if (response.ok) {
      const result = await response.json();
      toast.success((result as any)?.message ?? "Domain deleted successfully");
      onReloadData()
    } else {
      const result = await response.json();
      toast.error((result as any)?.message ?? 'Could not delete domain');
    }
  } catch (error) {
    console.error("Error in deleteDomainById:", error);
  }
}

export const changeLandingType = async (
  landingType: string, domainIds: string[], onReloadData: () => void
  ) => {
  try {
    const response = await fetch(`${bkUrl}/relink-email/domains/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: "jwt=your_jwt_token_here",
      },
      body: JSON.stringify({ landingType, domainIds }),
    });

    if (response.ok) {
      const result = await response.json();
      toast.success((result as any)?.message ?? "Domains updated successfully");
      onReloadData();
      
      return "ok"
    } else {
      toast.error('Could not update domains, retry later', {
        duration: 3000
      });
    }
  } catch (error) {
    console.error("Error in changeLandingType:", error);
  }
}