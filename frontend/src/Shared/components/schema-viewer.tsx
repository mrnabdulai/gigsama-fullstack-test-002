import  { useState } from 'react';

export const JsonSchemaDisplay = ({ schemaData }) => {
  const [activeTab, setActiveTab] = useState('visual');
  
  /**
   * Example data structure for schema visualization
   * This represents the expected format from the generateSchema function
   * 
   * const exampleData = {
   *   schemaJson: {
   *     entities: [
   *       {
   *         name: "Users",
   *         attributes: [
   *           { name: "id", type: "int", required: true, unique: true, primaryKey: true },
   *           { name: "name", type: "varchar", required: true },
   *           { name: "email", type: "varchar", required: true, unique: true },
   *           { name: "password", type: "varchar", required: true },
   *           { name: "phone", type: "varchar", required: false }
   *         ],
   *         relationships: [
   *           { name: "hasRoles", targetEntity: "Roles", type: "oneToMany", description: "User can have multiple roles" }
   *         ]
   *       },
   *       {
   *         name: "Roles",
   *         attributes: [
   *           { name: "id", type: "int", required: true, unique: true, primaryKey: true },
   *           { name: "role_name", type: "varchar", required: true }
   *         ],
   *         relationships: [
   *           { name: "hasPermissions", targetEntity: "Permissions Table", type: "oneToMany", description: "Role can have multiple permissions" }
   *         ]
   *       },
   *       {
   *         name: "Login History",
   *         attributes: [
   *           { name: "id", type: "int", required: true, unique: true, primaryKey: true },
   *           { name: "user_id", type: "int", required: true },
   *           { name: "login_time", type: "Timestamp", required: true },
   *           { name: "ip_address", type: "varchar", required: true }
   *         ],
   *         relationships: [
   *           { name: "belongsToUser", targetEntity: "Users", type: "manyToOne", description: "Login entry belongs to a user" }
   *         ]
   *       },
   *       {
   *         name: "Permissions Table",
   *         attributes: [
   *           { name: "id", type: "int", required: true, unique: true, primaryKey: true },
   *           { name: "role_id", type: "int", required: true },
   *           { name: "permission_name", type: "varchar", required: true },
   *           { name: "permission_id", type: "int", required: true }
   *         ],
   *         relationships: []
   *       }
   *     ]
   *   },
   *   schemaText: "This schema represents a user management system with roles and permissions tracking. It includes tables for Users, Roles, Login History, and Permissions. Users can have multiple roles, and roles can have multiple permissions. Login history tracks user logins with timestamps and IP addresses.",
   *   suggestedTitle: "User Management System Schema"
   * };
   */

  // Use passed data or example data
  const data = schemaData 
console.log(data)
  return (
    // <div className="w-full  bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="w-full  bg-white ">
      {/* Header with title */}
      {/* <div className="px-3 py-2 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-800">Generated Schema</h2>
      </div> */}

      {/* Tab navigation */}
      {/* <div className="px-6 py-2 border-b border-gray-200 flex">
        <button 
          className={`px-4 py-2 rounded-t-lg mr-2 ${activeTab === 'visual' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'}`}
          onClick={() => setActiveTab('visual')}
        >
          Visual Schema
        </button>
        <button 
          className={`px-4 py-2 rounded-t-lg mr-2 ${activeTab === 'text' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'}`}
          onClick={() => setActiveTab('text')}
        >
          Schema Description
        </button>
        <button 
          className={`px-4 py-2 rounded-t-lg ${activeTab === 'json' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'}`}
          onClick={() => setActiveTab('json')}
        >
          Raw JSON
        </button>
      </div> */}

      {/* Tab content */}
      <div className="p-6">
        {activeTab === 'visual' && (
          <div className="flex flex-wrap gap-8">
            {data.schemaJson.entities.map((entity) => (
              <div key={entity.name} className="w-full md:w-[230px] max-h-min bg-white  border-[1px] border-[#e1e4ea] overflow-hidden">
                <div className="px-3 py-1.5   bg-[#f3f3f3] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] border-b border-[#e1e3e9] font-semibold text-sm">
                  {entity.name}
                </div>
                <div className="overflow-hidden">
                  <table className="w-full border-collapse">
                    <tbody>
                      {entity.attributes.map((attribute) => (
                        <tr key={attribute.name} className="border-b border-gray-100 last:border-b-0">
                          <td className="px-4 py-2 text-left text-xs">
                            {attribute.name}
                            {attribute.primaryKey && (
                              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">PK</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-right text-xs text-gray-600">{attribute.type}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {entity.relationships && entity.relationships.length > 0 && (
                  <div className="px-4 py-2 bg-blue-50 border-t border-gray-200">
                    <div className="font-medium text-sm text-blue-600 mb-1">Relationships</div>
                    {entity.relationships.map((rel) => (
                      <div key={rel.name} className="text-xs text-gray-600 mb-1">
                        <span className="text-gray-800">{rel.name}</span>: {rel.type} → {rel.targetEntity}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'text' && (
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-800 whitespace-pre-wrap">{data.schemaText}</p>
          </div>
        )}

        {activeTab === 'json' && (
          <div className="bg-gray-50 p-4 rounded-md overflow-auto">
            <pre className="text-xs text-gray-800">{JSON.stringify(data.schemaJson, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonSchemaDisplay;