// ** JWT import
import toast from 'react-hot-toast'
import { UserBasicData } from 'src/@core/layouts/components/page-components/ProfileBasicInfoEdit'

// ** Mock Adapter

// ** Default AuthConfig
import bkUrl from 'src/configs/bkUrl'

// ** Types


export const loginSubmit = async (email: string, password: string) => {
  try {
    const response = await fetch(`${bkUrl}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json()
      
      return data
    } else {
      toast.error('Authentication failed');

      return undefined
    }
  } catch (error) {
    console.error('Server error:', error);
    
    return undefined
  }
}

export const updateUserInfo = async (id: string, data: UserBasicData) => {
  try {
    const response = await fetch(`${bkUrl}/user/${id}`, {
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
      toast.success((result as any)?.message ?? "User updated successfully");

      return "ok"
    } else {
      toast.error('Could not update user', {
        duration: 3000
      });
    }
  } catch (error) {
    console.error("Error in updateUser:", error);
  }
}