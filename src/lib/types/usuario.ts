export interface CreateAllowedEmployeeDto {
  cpf: string;
  name: string;
}

export interface AllowedEmployeeResponse {
  id?: number;
  cpf: string;
  name: string;
  registered?: boolean;
}

export interface UpdateAllowedEmployeeDto {
  id?: number;
  cpf: string;
  name: string;
  registered?: boolean;
}

export interface CreateUserDto {
  username: string;
  password?: string;
  email: string;
  phone: string;
  CPF: string;
  role?: string; 
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  phone: string;
  CPF: string;
}