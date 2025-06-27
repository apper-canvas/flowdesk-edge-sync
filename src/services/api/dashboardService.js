import { mockWidgets } from '@/services/mockData/dashboards'
import { toast } from 'react-toastify'

export const dashboardService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "is_default" } },
          { field: { Name: "layout" } },
          { field: { Name: "widgets" } },
          { field: { Name: "filters" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ],
        orderBy: [
          { fieldName: "createdAt", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords('dashboard', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching dashboards:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "is_default" } },
          { field: { Name: "layout" } },
          { field: { Name: "widgets" } },
          { field: { Name: "filters" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ]
      };

      const response = await apperClient.getRecordById('dashboard', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching dashboard with ID ${id}:`, error);
      throw error;
    }
  },

  async create(dashboardData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: dashboardData.name,
          description: dashboardData.description,
          is_default: false,
          layout: JSON.stringify(dashboardData.layout || []),
          widgets: JSON.stringify(dashboardData.widgets || []),
          filters: JSON.stringify(dashboardData.filters || {}),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('dashboard', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      console.error("Error creating dashboard:", error);
      throw error;
    }
  },

  async update(id, dashboardData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: dashboardData.name,
          description: dashboardData.description,
          is_default: dashboardData.is_default,
          layout: JSON.stringify(dashboardData.layout),
          widgets: JSON.stringify(dashboardData.widgets),
          filters: JSON.stringify(dashboardData.filters),
          updatedAt: new Date().toISOString()
        }]
      };

      const response = await apperClient.updateRecord('dashboard', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      console.error("Error updating dashboard:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('dashboard', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error("Error deleting dashboard:", error);
      throw error;
    }
  },

  async getWidgets() {
    // Return mock widgets for now as they're UI configuration
    return [...mockWidgets]
  },

  async getDefaultDashboard() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "is_default" } },
          { field: { Name: "layout" } },
          { field: { Name: "widgets" } },
          { field: { Name: "filters" } }
        ],
        where: [
          { FieldName: "is_default", Operator: "EqualTo", Values: [true] }
        ]
      };

      const response = await apperClient.fetchRecords('dashboard', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error("Error fetching default dashboard:", error);
      return null;
    }
  },

  async saveDashboardLayout(id, layout) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          layout: JSON.stringify(layout),
          updatedAt: new Date().toISOString()
        }]
      };

      return await this.update(id, { layout });
    } catch (error) {
      console.error("Error saving dashboard layout:", error);
      throw error;
    }
  },

  async duplicateDashboard(id) {
    try {
      const originalDashboard = await this.getById(id);
      if (!originalDashboard) {
        throw new Error('Dashboard not found');
      }

      const duplicatedData = {
        name: `Copy of ${originalDashboard.Name}`,
        description: originalDashboard.description,
        layout: originalDashboard.layout ? JSON.parse(originalDashboard.layout) : [],
        widgets: originalDashboard.widgets ? JSON.parse(originalDashboard.widgets) : [],
        filters: originalDashboard.filters ? JSON.parse(originalDashboard.filters) : {}
      };

      return await this.create(duplicatedData);
    } catch (error) {
      console.error("Error duplicating dashboard:", error);
      throw error;
    }
  }
}