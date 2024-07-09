import toast from "react-hot-toast";
import bkUrl from "src/configs/bkUrl";
import { tpMiscSettings, ParsingConditionRowType, WarehousesRowType } from "../types";

export const addWarehouse = async (data: WarehousesRowType) => {
  try {
    const response = await fetch(`${bkUrl}/parsingSettings/warehouses/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: "jwt=your_jwt_token_here",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      toast.success((result as any)?.message ?? "Channel added successfully");

      return "ok"
    } else {
      toast.error('Could not add channel', {
        duration: 3000
      });
    }
  } catch (error) {
    console.error("Error in addWarehouse:", error);
  }
}

export const updateWarehouse = async (id: string, data: WarehousesRowType) => {
  try {
    const response = await fetch(`${bkUrl}/parsingSettings/warehouses/${id}`, {
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
      toast.success((result as any)?.message ?? "Channel updated successfully");

      return "ok"
    } else {
      toast.error('Could not update channel', {
        duration: 3000
      });
    }
  } catch (error) {
    console.error("Error in updateWarehouse:", error);
  }
}

export const deleteWarehouse = async (id: string, onReloadData: () => void) => {
  try {
    const response = await fetch(`${bkUrl}/parsingSettings/warehouses/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: "jwt=your_jwt_token_here",
      },
    });

    if (response.ok) {
      const result = await response.json();
      toast.success((result as any)?.message ?? "Removed channel successfully")
      onReloadData();
    } else {
      toast.error('Error deleting channel', {
        duration: 2000
      });
    }
  } catch (error) {
    console.error("Error deleting warehouse:", error);
  }
}

export const deleteCondition = async (id: string, onReloadData: () => void) => {
  try {
    const response = await fetch(`${bkUrl}/parsingSettings/conditions/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: "jwt=your_jwt_token_here",
      },
    });

    if (response.ok) {
      const result = await response.json();
      toast.success((result as any)?.message ?? "Removed condition check successfully")
      onReloadData();
    } else {
      toast.error('Error deleting check', {
        duration: 2000
      });
    }
  } catch (error) {
    console.error("Error deleting deleteCondition:", error);
  }
}

export const addParseCondition = async (data: ParsingConditionRowType) => {
  try {
    const response = await fetch(`${bkUrl}/parsingSettings/conditions/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: "jwt=your_jwt_token_here",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      toast.success((result as any)?.message ?? "Condition added successfully");

      return "ok"
    } else {
      toast.error('Could not add condition', {
        duration: 3000
      });
    }
  } catch (error) {
    console.error("Error in addCondition:", error);
  }
}

export const updateCronSettings = async (id: string, data: tpMiscSettings) => {
  try {
    const response = await fetch(`${bkUrl}/parsingSettings/cron/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: "jwt=your_jwt_token_here",
      },
      body: JSON.stringify(
        {...data, id}
      ),
    });

    if (response.ok) {
      const result = await response.json();
      toast.success((result as any)?.message ?? "Settings updated successfully");

      return "ok"
    } else {
      toast.error('Could not update settings', {
        duration: 3000
      });
    }
  } catch (error) {
    console.error("Error in updateCronSettings:", error);
  }
}