import { Component } from '@angular/core';
import { NgFor, CurrencyPipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/products';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {
  title = 'Listado de productos';
  showForm = false;
  showSuccess = false;
  successMessage = '';
  isEditing = false;

  errors: { name?: string; description?: string; price?: string } = {};

  formData: Product = { id: 0, name: '', description: '', price: 0 };

  products: Product[] = [
    { id: 1, name: 'Laptop', description: 'Laptop gamer', price: 1500000 },
    { id: 2, name: 'Mouse', description: 'Mouse inalámbrico', price: 50000 },
    { id: 3, name: 'Teclado', description: 'Teclado mecánico', price: 120000 },
    { id: 4, name: 'Monitor', description: 'Monitor 4K', price: 800000 },
  ];

  openAddForm() {
    this.isEditing = false;
    this.formData = { id: 0, name: '', description: '', price: 0 };
    this.errors = {};
    this.showForm = true;
  }

  openEditForm(product: Product) {
    this.isEditing = true;
    this.formData = { ...product };
    this.errors = {};
    this.showForm = true;
  }

  validate(): boolean {
    this.errors = {};

    if (!this.formData.name.trim())
      this.errors.name = 'El nombre es obligatorio';
    else if (this.formData.name.trim().length < 3)
      this.errors.name = 'Mínimo 3 caracteres';

    if (!this.formData.description.trim())
      this.errors.description = 'La descripción es obligatoria';

    if (!this.formData.price || this.formData.price <= 0)
      this.errors.price = 'El precio debe ser mayor a 0';

    return Object.keys(this.errors).length === 0;
  }

  submitForm() {
    if (!this.validate()) return;

    if (this.isEditing) {
      const index = this.products.findIndex(p => p.id === this.formData.id);
      this.products[index] = { ...this.formData };
      this.notify('Producto actualizado exitosamente ✓');
    } else {
      const newId = Math.max(...this.products.map(p => p.id)) + 1;
      this.products.push({ ...this.formData, id: newId });
      this.notify('Producto agregado exitosamente ✓');
    }

    this.showForm = false;
  }

  deleteProduct(id: number) {
    this.products = this.products.filter(p => p.id !== id);
    this.notify('Producto eliminado ✓');
  }

  notify(msg: string) {
    this.successMessage = msg;
    this.showSuccess = true;
    setTimeout(() => this.showSuccess = false, 3000);
  }

  cancelForm() {
    this.showForm = false;
    this.errors = {};
  }
}