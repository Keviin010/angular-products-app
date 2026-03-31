import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/products';
import { ProductService } from './products.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  title = 'Listado de productos';
  showForm = false;
  showSuccess = false;
  successMessage = '';
  isEditing = false;
  errors: { name?: string; description?: string; price?: string } = {};
  formData: Product = { id: 0, name: '', description: '', price: 0 };
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe(data => this.products = data);
  }

  openAddForm(): void {
    this.isEditing = false;
    this.formData = { id: 0, name: '', description: '', price: 0 };
    this.errors = {};
    this.showForm = true;
  }

  openEditForm(product: Product): void {
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
      this.errors.name = 'Minimo 3 caracteres';
    if (!this.formData.description.trim())
      this.errors.description = 'La descripcion es obligatoria';
    if (!this.formData.price || this.formData.price <= 0)
      this.errors.price = 'El precio debe ser mayor a 0';
    return Object.keys(this.errors).length === 0;
  }

  submitForm(): void {
    if (!this.validate()) return;

    if (this.isEditing) {
      this.productService.update(this.formData.id, this.formData).subscribe(() => {
        this.loadProducts();
        this.notify('Producto actualizado exitosamente');
      });
    } else {
      this.productService.create(this.formData).subscribe(() => {
        this.loadProducts();
        this.notify('Producto agregado exitosamente');
      });
    }
    this.showForm = false;
  }

  deleteProduct(id: number): void {
    this.productService.delete(id).subscribe(() => {
      this.loadProducts();
      this.notify('Producto eliminado');
    });
  }

  notify(msg: string): void {
    this.successMessage = msg;
    this.showSuccess = true;
    setTimeout(() => this.showSuccess = false, 3000);
  }

  cancelForm(): void {
    this.showForm = false;
    this.errors = {};
  }
}